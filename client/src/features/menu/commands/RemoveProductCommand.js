export default class RemoveProductCommand {
    constructor(setItem, product, currentQuantity) {
        this.setItem = setItem;
        this.product = product;
        this.currentQuantity = currentQuantity;
    }

    execute() {
        const { id, name, price } = this.product;
        const quantity = this.currentQuantity - 1;

        this.setItem({
            name,
            price,
            productId: id,
            subtotal: price * quantity,
            quantity,
        });
    }
}
