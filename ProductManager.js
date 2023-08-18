const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async readData() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async saveData(data) {
        await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
    }

    async addProduct(product) {
        const products = await this.readData();

        const lastProductId = products.length > 0 ? products[products.length - 1].id : 0;
        const newProduct = {
            ...product,
            id: lastProductId + 1
        };

        products.push(newProduct);
        await this.saveData(products);

        return newProduct;
    }

    async getProducts() {
        return await this.readData();
    }

    async getProductById(id) {
        const products = await this.readData();
        return products.find(product => product.id === id);
    }

    async updateProduct(id, updatedFields) {
        const products = await this.readData();
        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex !== -1) {
            products[productIndex] = {
                ...products[productIndex],
                ...updatedFields,
                id // Ensure the ID is not changed
            };

            await this.saveData(products);
            return products[productIndex];
        }

        return null;
    }

    async deleteProduct(id) {
        const products = await this.readData();
        const updatedProducts = products.filter(product => product.id !== id);

        if (updatedProducts.length !== products.length) {
            await this.saveData(updatedProducts);
            return true;
        }

        return false;
    }
}

module.exports = ProductManager;

//Descomentar para el testing

// (async () => {
//     const productManager = new ProductManager('products.json');

//     const initialProducts = await productManager.getProducts();
//     console.log('Initial Products:', initialProducts);

//     const newProduct = await productManager.addProduct({
//         title: 'producto prueba',
//         description: 'Este es un producto prueba',
//         price: 200,
//         thumbnail: 'Sin imagen',
//         code: 'abc123',
//         stock: 25
//     });
//     console.log('New Product:', newProduct);

//     const productsAfterAdding = await productManager.getProducts();
//     console.log('Products After Adding:', productsAfterAdding);

//     const productIdToRetrieve = newProduct.id;
//     const retrievedProduct = await productManager.getProductById(productIdToRetrieve);
//     console.log('Retrieved Product by ID:', retrievedProduct);

//     const updatedProduct = await productManager.updateProduct(productIdToRetrieve, { price: 250 });
//     console.log('Updated Product:', updatedProduct);

//     const deleteResult = await productManager.deleteProduct(productIdToRetrieve);
//     console.log('Delete Result:', deleteResult);

//     const productsAfterDeleting = await productManager.getProducts();
//     console.log('Products After Deleting:', productsAfterDeleting);
// })();