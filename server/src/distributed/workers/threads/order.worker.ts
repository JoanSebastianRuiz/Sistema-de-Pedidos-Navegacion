import _ from 'lodash';
import { parentPort, threadId } from 'node:worker_threads';
import { OrderStatus } from 'src/shared/domain/order-status.enum';
import { ThreadTask } from '../types/thread-task.type';

if (!parentPort) {
  throw new Error('Worker thread must be started with parentPort');
}

const workerPort = parentPort;

workerPort.on('message', (task: ThreadTask) => {
  const startTime = Date.now();

  console.log(`[Thread ${threadId}] Processing task ${task.taskId}`);

  if (task.type === 'process-order') {
    const { order, products } = task;

    const existingProductsById = _.keyBy(products, 'id');

    const total = order.orderDetails.reduce((acc, detail) => {
      const product = existingProductsById[detail.productId];
      return acc + product.price * detail.quantity;
    }, 0);

    const orderDetailsToInsert = order.orderDetails.map((detail) => {
      const product = existingProductsById[detail.productId];
      const subtotal = product.price * detail.quantity;
      return {
        ...detail,
        unitPrice: product.price,
        subtotal,
      };
    });

    workerPort.postMessage({
      taskId: task.taskId,
      type: 'process-order',
      data: {
        total,
        orderDetails: orderDetailsToInsert,
      },
      processingTime: Date.now() - startTime,
    });

    return;
  }

  if (task.type === 'validate-order-status') {
    const statuses = Object.values(OrderStatus);

    const validStatuses = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING],
      [OrderStatus.PREPARING]: [OrderStatus.READY],
      [OrderStatus.READY]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    if (!statuses.includes(task.status)) {
      workerPort.postMessage({
        taskId: task.taskId,
        type: 'validate-order-status',
        data: {
          isValid: false,
          message: `Invalid status: ${task.status}`,
        },
        processingTime: Date.now() - startTime,
      });
      return;
    }

    const allowedStatuses = validStatuses[task.currentStatus];

    const isValid = allowedStatuses
      ? allowedStatuses.includes(task.status)
      : false;

    workerPort.postMessage({
      taskId: task.taskId,
      type: 'validate-order-status',
      data: {
        isValid,
      },
      processingTime: Date.now() - startTime,
    });
  }
});
