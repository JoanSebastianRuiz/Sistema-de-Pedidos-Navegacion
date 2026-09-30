import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { Worker } from 'node:worker_threads';
import { join } from 'node:path';

import { ThreadTask } from '../types/thread-task.type';

interface PendingTask {
  task: ThreadTask;
  resolve: (result: unknown) => void;
  reject: (error: Error) => void;
}

interface PoolWorker {
  worker: Worker;
  busy: boolean;
  taskId?: string;
}

interface WorkerResult {
  taskId: string;
  type: string;
  data?: unknown;
  processingTime: number;
}

@Injectable()
export class ThreadPoolService implements OnModuleInit, OnModuleDestroy {
  private readonly poolSize = 3;

  private workers: PoolWorker[] = [];

  private queue: PendingTask[] = [];

  private callbacks = new Map<
    string,
    {
      resolve: (result: unknown) => void;
      reject: (error: Error) => void;
    }
  >();

  private isShuttingDown = false;

  async onModuleInit() {
    for (let index = 0; index < this.poolSize; index++) {
      this.createWorker(index);
    }

    console.log(`[ThreadPool] Started with ${this.poolSize} threads`);
  }

  private createWorker(index: number) {
    const worker = new Worker(
      join(__dirname, '..', 'threads', 'order.worker.js'),
    );

    const poolWorker: PoolWorker = {
      worker,
      busy: false,
    };

    worker.on('message', (result: WorkerResult) => {
      this.handleWorkerResult(poolWorker, result);
    });

    worker.on('error', (error) => {
      console.error(`[ThreadPool] Thread ${index} error`, error);

      if (poolWorker.taskId) {
        const callback = this.callbacks.get(poolWorker.taskId);

        callback?.reject(error);

        this.callbacks.delete(poolWorker.taskId);
      }

      poolWorker.busy = false;
      poolWorker.taskId = undefined;

      if (this.workers[index] === poolWorker) {
        this.workers[index] = undefined as unknown as PoolWorker;
      }

      if (this.isShuttingDown) {
        return;
      }

      this.createWorker(index);
      this.processQueue();
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`[ThreadPool] Thread ${index} exited with code ${code}`);
      }

      if (!this.isShuttingDown && this.workers[index]?.worker === worker) {
        this.workers[index] = undefined as unknown as PoolWorker;
        this.createWorker(index);
        this.processQueue();
      }
    });

    this.workers[index] = poolWorker;

    console.log(`[ThreadPool] Thread ${index} created`);
  }

  execute<T>(task: ThreadTask): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const callback = {
        resolve: (result: unknown) => {
          resolve(result as T);
        },
        reject,
      };

      this.queue.push({
        task,
        resolve: callback.resolve,
        reject,
      });

      this.callbacks.set(task.taskId, callback);

      this.processQueue();
    });
  }

  private processQueue() {
    const availableWorker = this.workers.find(
      (poolWorker) => poolWorker && !poolWorker.busy,
    );

    if (!availableWorker || this.queue.length === 0) {
      return;
    }

    const pendingTask = this.queue.shift();

    if (!pendingTask) {
      return;
    }

    availableWorker.busy = true;
    availableWorker.taskId = pendingTask.task.taskId;

    availableWorker.worker.postMessage(pendingTask.task);

    console.log(`[ThreadPool] Task ${pendingTask.task.taskId} assigned`);

    this.processQueue();
  }

  private handleWorkerResult(poolWorker: PoolWorker, result: WorkerResult) {
    const callback = this.callbacks.get(result.taskId);

    callback?.resolve(result);

    this.callbacks.delete(result.taskId);

    poolWorker.busy = false;
    poolWorker.taskId = undefined;

    console.log(
      `[ThreadPool] Task ${result.taskId} completed in ${result.processingTime} ms`,
    );

    this.processQueue();
  }

  async onModuleDestroy() {
    this.isShuttingDown = true;

    await Promise.all(
      this.workers.filter(Boolean).map(({ worker }) => worker.terminate()),
    );

    this.workers = [];

    console.log('[ThreadPool] All threads terminated');
  }
}
