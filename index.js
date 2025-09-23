document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { name: "Baguete longa", weight: 300 },
        { name: "Calabresa", weight: 176 },
        { name: "Azeitonas", weight: 176 },
        { name: "Rolls", weight: 350 },
        { name: "Focaccias", weight: 300 },
        { name: "Puff", weight: 60 },
        { name: "Choco Amendoa", weight: 60 },
        { name: "Discos", weight: 50 },
        //{ name: "Disco", weight: 130 },
        { name: "Pão Simples", weight: 380 }
    ];

    const productList = document.getElementById("product-list");
    const totalMassElement = document.getElementById("total-mass");

    function renderProducts() {
        productList.innerHTML = ""; // Clear the list before rendering
        let totalWeight = 0;
        let productListArray = [];
        products.forEach((product, index) => {
            const row = document.createElement("div");
            row.className = "product-row";

            // Product name and weight
            const nameSpan = document.createElement("span");
            nameSpan.className = "product-name";
            nameSpan.textContent = `${product.name} (${product.weight}g)`;

            // Quantity controls container
            const quantityControls = document.createElement("div");
            quantityControls.className = "quantity-controls";

            // Decrement button
            const decrementBtn = document.createElement("button");
            decrementBtn.className = "quantity-btn decrement";
            decrementBtn.textContent = "-";

            // Quantity input
            const quantityInput = document.createElement("input");
            quantityInput.type = "number";
            quantityInput.className = "quantity-input";
            quantityInput.value = 0;
            quantityInput.min = 0;
            quantityInput.readOnly = true; // Make input read-only

            // Increment button
            const incrementBtn = document.createElement("button");
            incrementBtn.className = "quantity-btn increment";
            incrementBtn.textContent = "+";

            // Subtotal
            const subtotal = document.createElement("span");
            subtotal.className = "product-subtotal";
            subtotal.textContent = `Sub: 0g`;

            // Event listeners for increment and decrement
            decrementBtn.addEventListener("click", () => {
                let currentValue = parseInt(quantityInput.value) || 0;
                if (currentValue > 0) {
                    quantityInput.value = currentValue - 1;
                    updateSubtotal();
                }
            });

            incrementBtn.addEventListener("click", () => {
                let currentValue = parseInt(quantityInput.value) || 0;
                quantityInput.value = currentValue + 1;
                updateSubtotal();
            });

            function updateSubtotal() {
                const quantity = parseInt(quantityInput.value) || 0;
                const subtotalWeight = product.weight * quantity;
                subtotal.textContent = `Sub: ${subtotalWeight}g`;
                calculateTotalMass();
                //aqui
                productListArray[product.name] = quantity;
                addProductListText(productListArray);
            }

            // Append elements
            quantityControls.appendChild(decrementBtn);
            quantityControls.appendChild(quantityInput);
            quantityControls.appendChild(incrementBtn);

            row.appendChild(nameSpan);
            row.appendChild(quantityControls);
            row.appendChild(subtotal);
            productList.appendChild(row);
        });

        calculateTotalMass();
    }

    function addProductListText(productListArray) {
        let productListText = "";
        for (const product in productListArray) {
            productListText += `${product}: ${productListArray[product]}x\n`;
        }
        document.getElementById("productListText").value = productListText;
    }

    function calculateTotalMass() {
        let totalWeight = 0;
        const rows = productList.getElementsByClassName("product-row");

        for (const row of rows) {
            const quantityInput = row.querySelector(".quantity-input");
            const quantity = parseInt(quantityInput.value) || 0;
            const productWeight = parseInt(row.textContent.match(/\((\d+)g\)/)[1]);
            totalWeight += productWeight * quantity;
        }

        // Calculate number of masses needed (dividing total weight by 350g)
        const massesNeeded = Math.ceil(totalWeight / 350);

        // Update total mass display to show both total weight and masses needed
        totalMassElement.textContent = `${totalWeight}g (${massesNeeded} massas)`;
    }

    renderProducts();
});

function copiarListaProdutos() {
    const textArea = document.getElementById('productListText');

    if (textArea.value.trim() === '') {
        alert('Não há produtos com quantidade para copiar.');
        return;
    }

    navigator.clipboard.writeText(textArea.value)
        .then(() => {
            alert('Lista copiada para a área de transferência!');
        })
        .catch(err => {
            console.error('Erro ao copiar texto: ', err);
            // Fallback para navegadores que não suportam clipboard API
            textArea.select();
            document.execCommand('copy');
            alert('Lista copiada para a área de transferência!');
        });
}

// Adicionar event listener para o botão de copiar
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...

    const copyBtn = document.getElementById('copyProductListBtn');
    copyBtn.addEventListener('click', copiarListaProdutos);
});

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/calcmassas/sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}
