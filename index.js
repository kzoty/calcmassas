const products = [
    { name: "Baguete longa", weight: 300 },
    { name: "Calabresa", weight: 176 },
    { name: "Azeitonas", weight: 176 },
    { name: "Rolls", weight: 350 },
    { name: "Focaccias", weight: 300 },
    { name: "Puff", weight: 60 },
    { name: "Choco Amendoa", weight: 60 },
    { name: "Discos", weight: 50 },
    { name: "Pão Simples", weight: 380 }
];

const quantities = {};

document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById("product-list");
    const totalMassElement = document.getElementById("total-mass");
    const productListText = document.getElementById("productListText");
    const copyBtn = document.getElementById('copyProductListBtn');

    function renderProducts() {
        productList.innerHTML = "";
        products.forEach(product => {
            quantities[product.name] = 0;

            const row = document.createElement("div");
            row.className = "product-row";

            const nameSpan = document.createElement("span");
            nameSpan.className = "product-name";
            nameSpan.textContent = `${product.name} (${product.weight}g)`;

            const quantityControls = document.createElement("div");
            quantityControls.className = "quantity-controls";

            const decrementBtn = document.createElement("button");
            decrementBtn.className = "quantity-btn decrement";
            decrementBtn.textContent = "−";

            const quantityInput = document.createElement("input");
            quantityInput.type = "number";
            quantityInput.className = "quantity-input";
            quantityInput.value = 0;
            quantityInput.min = 0;
            quantityInput.readOnly = true;

            const incrementBtn = document.createElement("button");
            incrementBtn.className = "quantity-btn increment";
            incrementBtn.textContent = "+";

            const subtotal = document.createElement("span");
            subtotal.className = "product-subtotal";
            subtotal.textContent = "0g";

            decrementBtn.addEventListener("click", () => {
                if (quantities[product.name] > 0) {
                    quantities[product.name]--;
                    updateDisplay(product, quantityInput, subtotal);
                }
            });

            incrementBtn.addEventListener("click", () => {
                quantities[product.name]++;
                updateDisplay(product, quantityInput, subtotal);
            });

            quantityControls.appendChild(decrementBtn);
            quantityControls.appendChild(quantityInput);
            quantityControls.appendChild(incrementBtn);

            row.appendChild(nameSpan);
            row.appendChild(quantityControls);
            row.appendChild(subtotal);
            productList.appendChild(row);
        });
    }

    function updateDisplay(product, input, subtotal) {
        input.value = quantities[product.name];
        subtotal.textContent = `${product.weight * quantities[product.name]}g`;
        updateTotal();
        updateProductListText();
    }

    function updateTotal() {
        let totalWeight = 0;
        products.forEach(product => {
            totalWeight += product.weight * quantities[product.name];
        });
        const massesNeeded = Math.ceil(totalWeight / 350);
        totalMassElement.textContent = `${totalWeight}g (${massesNeeded} massas)`;
    }

    function updateProductListText() {
        let text = "";
        products.forEach(product => {
            if (quantities[product.name] > 0) {
                text += `${product.name}: ${quantities[product.name]}x\n`;
            }
        });
        productListText.value = text;
    }

    function copyProductList() {
        if (productListText.value.trim() === '') {
            alert('Não há produtos com quantidade para copiar.');
            return;
        }
        navigator.clipboard.writeText(productListText.value)
            .then(() => alert('Lista copiada!'))
            .catch(() => {
                productListText.select();
                document.execCommand('copy');
                alert('Lista copiada!');
            });
    }

    copyBtn.addEventListener('click', copyProductList);
    renderProducts();
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/calcmassas/sw.js')
            .then(() => console.log('SW registrado'))
            .catch(err => console.log('Erro SW:', err));
    });
}
