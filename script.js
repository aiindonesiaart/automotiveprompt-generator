document.addEventListener('DOMContentLoaded', function() {
    // Vehicle subtype options
    const vehicleSubtypes = {
        car: ["micro", "sedan", "hatchback", "universal", "liftback", "coupe", "cabriolet", "roadster", "targa", "limousine", "muscle car", "sport car", "super car", "SUV", "crossover", "pickup", "van", "minivan", "minibus", "campervan", "bus", "tow truck", "mini truck", "dump truck"],
        motorcycle: ["ATV", "cruiser", "scrambler", "scooter", "supersport", "sport touring", "streetfighter", "naked", "touring", "enduro", "cross", "chopper"],
        other: ["police car", "military vehicle", "tank", "train", "helicopter", "jet"]
    };

    // Update subtype options based on vehicle type selection
    document.getElementById('vehicle-type').addEventListener('change', function() {
        const type = this.value;
        const subtypeContainer = document.getElementById('subtype-container');
        
        if (type && vehicleSubtypes[type]) {
            subtypeContainer.innerHTML = `
                <label for="subtype">${type.charAt(0).toUpperCase() + type.slice(1)} Type:</label>
                <select id="subtype">
                    <option value="">Select ${type} type</option>
                    ${vehicleSubtypes[type].map(opt => `<option value="${opt}">${opt.charAt(0).toUpperCase() + opt.slice(1)}</option>`).join('')}
                </select>
            `;
            
            // Add event listener to the new select element
            document.getElementById('subtype').addEventListener('change', generatePrompt);
        } else {
            subtypeContainer.innerHTML = '';
        }
        
        generatePrompt();
    });

    // Generate prompt when any selection changes
    document.querySelectorAll('select, input').forEach(element => {
        element.addEventListener('change', generatePrompt);
    });
    
    document.getElementById('edition').addEventListener('input', generatePrompt);

    // Copy functionality
    document.getElementById('copy-btn').addEventListener('click', function() {
        const promptText = document.getElementById('generated-prompt');
        promptText.select();
        document.execCommand('copy');
        
        // Show feedback
        const originalText = this.textContent;
        this.textContent = 'Copied!';
        this.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            this.textContent = originalText;
            this.style.backgroundColor = '';
        }, 2000);
    });

    // WhatsApp share functionality
    document.getElementById('share-whatsapp').addEventListener('click', function() {
        const promptText = encodeURIComponent(document.getElementById('generated-prompt').value);
        if (promptText.trim() === '') {
            alert('Please generate a prompt first!');
            return;
        }
        window.open(`https://wa.me/?text=${promptText}`, '_blank');
    });

    // Randomize functionality
    document.getElementById('randomize-btn').addEventListener('click', function() {
        const selects = document.querySelectorAll('select');
        selects.forEach(select => {
            if (select.id !== 'subtype') { // Skip subtype as it's handled by vehicle-type
                const options = select.querySelectorAll('option');
                if (options.length > 1) { // Skip if only the default option exists
                    const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;
                    select.selectedIndex = randomIndex;
                }
            }
        });
        
        // Randomize edition year between 1950 and 2025
        const randomYear = Math.floor(Math.random() * (2025 - 1950 + 1)) + 1950;
        document.getElementById('edition').value = randomYear;
        
        // Trigger change event to update prompt
        document.getElementById('vehicle-type').dispatchEvent(new Event('change'));
        generatePrompt();
    });

    // Clear all functionality
    document.getElementById('clear-btn').addEventListener('click', function() {
        document.querySelectorAll('select').forEach(select => {
            select.selectedIndex = 0;
        });
        document.getElementById('edition').value = '';
        document.getElementById('generated-prompt').value = '';
        document.getElementById('subtype-container').innerHTML = '';
    });

    function generatePrompt() {
        const perspective = document.getElementById('perspective').value;
        const artStyle = document.getElementById('art-style').value;
        const vehicleType = document.getElementById('vehicle-type').value;
        const subtype = document.getElementById('subtype')?.value || '';
        const brand = document.getElementById('brand').value;
        const color = document.getElementById('color').value;
        const accessories = document.getElementById('accessories').value;
        const condition = document.getElementById('condition').value;
        const edition = document.getElementById('edition').value;
        const location = document.getElementById('location').value;
        const skyStyle = document.getElementById('sky-style').value;
        
        let promptParts = [];
        
        // Art style and perspective
        if (artStyle) promptParts.push(`${artStyle} style`);
        if (perspective) promptParts.push(`from ${perspective}`);
        
        // Vehicle description
        let vehicleDesc = [];
        if (vehicleType) vehicleDesc.push(vehicleType);
        if (subtype) vehicleDesc.push(subtype);
        if (brand) vehicleDesc.push(brand);
        if (color) vehicleDesc.push(color);
        if (accessories) vehicleDesc.push(accessories);
        if (condition) vehicleDesc.push(condition);
        if (edition) vehicleDesc.push(`${edition} edition`);
        
        if (vehicleDesc.length > 0) {
            promptParts.push(vehicleDesc.join(' '));
        }
        
        // Environment
        let environment = [];
        if (location) environment.push(location);
        if (skyStyle) environment.push(`under ${skyStyle} sky`);
        
        if (environment.length > 0) {
            promptParts.push(`set in ${environment.join(', ')}`);
        }
        
        const fullPrompt = promptParts.join(', ');
        document.getElementById('generated-prompt').value = fullPrompt;
    }

    // Generate initial empty prompt
    generatePrompt();
});
