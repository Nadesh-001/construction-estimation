// ===================================
// CALCULATORS
// ===================================

// Pricing data (location-based)
const pricingData = {
    'tamil-nadu': {
        'chennai': { perSqft: 1800, cement: 400, sand: 50, aggregate: 60, bricks: 8, steel: 65, rmc: 5500 },
        'coimbatore': { perSqft: 1600, cement: 380, sand: 45, aggregate: 55, bricks: 7, steel: 62, rmc: 5200 },
        'madurai': { perSqft: 1500, cement: 370, sand: 42, aggregate: 52, bricks: 6.5, steel: 60, rmc: 5000 },
        'kanyakumari': { perSqft: 1450, cement: 360, sand: 40, aggregate: 50, bricks: 6, steel: 58, rmc: 4800 },
        'default': { perSqft: 1500, cement: 370, sand: 45, aggregate: 55, bricks: 7, steel: 60, rmc: 5000 }
    },
    'kerala': {
        'thiruvananthapuram': { perSqft: 1700, cement: 390, sand: 48, aggregate: 58, bricks: 7.5, steel: 63, rmc: 5300 },
        'kochi': { perSqft: 1750, cement: 395, sand: 49, aggregate: 59, bricks: 7.8, steel: 64, rmc: 5400 },
        'default': { perSqft: 1700, cement: 390, sand: 48, aggregate: 58, bricks: 7.5, steel: 63, rmc: 5300 }
    },
    'karnataka': {
        'bangalore': { perSqft: 1900, cement: 410, sand: 52, aggregate: 62, bricks: 8.5, steel: 67, rmc: 5600 },
        'mysore': { perSqft: 1550, cement: 375, sand: 46, aggregate: 56, bricks: 7.2, steel: 61, rmc: 5100 },
        'default': { perSqft: 1700, cement: 390, sand: 48, aggregate: 58, bricks: 7.5, steel: 63, rmc: 5300 }
    }
};

// Material prices (per unit)
const materialPrices = {
    paint: 350, // per liter
    labor: 250 // per sqft for painting
};

// Concrete grade ratios (cement:sand:aggregate)
const concreteGrades = {
    'M10': { cement: 1, sand: 3, aggregate: 6, strength: 'Low' },
    'M15': { cement: 1, sand: 2, aggregate: 4, strength: 'Medium' },
    'M20': { cement: 1, sand: 1.5, aggregate: 3, strength: 'High' },
    'M25': { cement: 1, sand: 1, aggregate: 2, strength: 'Very High' }
};

// ===================================
// 1. CONSTRUCTION COST CALCULATOR
// ===================================

async function calculateConstructionCost() {
    const state = document.getElementById('location-state').value;
    const city = document.getElementById('location-city').value;
    const pincode = document.getElementById('pincode').value;
    const area = parseFloat(document.getElementById('construction-area').value);
    const resultDiv = document.getElementById('construction-result');

    // Validation
    if (!state || !city || !area) {
        showToast('Please fill in all fields');
        return;
    }

    if (pincode && (pincode.length !== 6 || !/^\d+$/.test(pincode))) {
        showToast('Please enter a valid 6-digit pincode');
        return;
    }

    try {
        // Show loading state
        resultDiv.innerHTML = '<div style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary-color);"></i><p>Calculating...</p></div>';
        resultDiv.classList.add('show');

        // For now, use a simple calculation based on area
        // In a full integration, you'd call the backend with more parameters
        const response = await api.calculateConstructionCost(area, area, 1, 'standard');

        // Display results
        resultDiv.innerHTML = `
            <h4><i class="fas fa-check-circle"></i> Cost Estimate</h4>
            <div class="result-item">
                <span class="result-label">Total Area</span>
                <span class="result-value">${formatNumber(response.total_area, 0)} sq.ft</span>
            </div>
            <div class="result-item">
                <span class="result-label">Material Cost</span>
                <span class="result-value">${formatCurrency(response.total_material_cost)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Labor Cost</span>
                <span class="result-value">${formatCurrency(response.total_labor_cost)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Cost</span>
                <span class="result-value">${formatCurrency(response.total_cost)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Cost per Sq.Ft</span>
                <span class="result-value">${formatCurrency(response.cost_per_sqft)}</span>
            </div>
            <p style="margin-top: 10px; font-size: 0.875rem; color: var(--text-secondary);">
                <i class="fas fa-info-circle"></i> Quality: ${response.quality}
            </p>
        `;
    } catch (error) {
        resultDiv.innerHTML = `
            <div style="color: #dc3545; text-align: center; padding: 20px;">
                <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <p>${error.message || 'Failed to calculate cost. Please try again.'}</p>
            </div>
        `;
        showToast('Calculation failed. Please try again.');
    }
}

// ===================================
// 2. CONCRETE FOR SLABS CALCULATOR
// ===================================

async function calculateConcrete() {
    const length = parseFloat(document.getElementById('slab-length').value);
    const breadth = parseFloat(document.getElementById('slab-breadth').value);
    const depth = parseFloat(document.getElementById('slab-depth').value);
    const unit = document.getElementById('slab-unit').value;
    const grade = document.getElementById('concrete-grade').value;
    const resultDiv = document.getElementById('concrete-result');

    // Validation
    if (!length || !breadth || !depth) {
        showToast('Please fill in all dimensions');
        return;
    }

    try {
        // Show loading
        resultDiv.innerHTML = '<div style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary-color);"></i><p>Calculating...</p></div>';
        resultDiv.classList.add('show');

        // Convert to meters if needed
        let l = length, b = breadth, d = depth;
        if (unit === 'feet') {
            l = length * 0.3048;
            b = breadth * 0.3048;
            d = depth * 0.3048;
        }

        const response = await api.calculateConcreteSlab(l, b, d);

        resultDiv.innerHTML = `
            <h4><i class="fas fa-check-circle"></i> Material Requirements (${grade})</h4>
            <div class="result-item">
                <span class="result-label">Volume</span>
                <span class="result-value">${formatNumber(response.volume)} m³</span>
            </div>
            <div class="result-item">
                <span class="result-label">Cement</span>
                <span class="result-value">${formatNumber(response.cement_bags)} bags</span>
            </div>
            <div class="result-item">
                <span class="result-label">Sand</span>
                <span class="result-value">${formatNumber(response.sand_ton)} tons</span>
            </div>
            <div class="result-item">
                <span class="result-label">Aggregate</span>
                <span class="result-value">${formatNumber(response.aggregate_ton)} tons</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Cost</span>
                <span class="result-value">${formatCurrency(response.total_cost)}</span>
            </div>
            <p style="margin-top: 10px; font-size: 0.875rem; color: var(--text-secondary);">
                <i class="fas fa-info-circle"></i> Includes material costs
            </p>
        `;
    } catch (error) {
        resultDiv.innerHTML = `
            <div style="color: #dc3545; text-align: center; padding: 20px;">
                <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <p>${error.message || 'Calculation failed'}</p>
            </div>
        `;
        showToast('Calculation failed. Please try again.');
    }
}

// ===================================
// 3. RAW MATERIAL CALCULATOR
// ===================================

function calculateRawMaterial() {
    const area = parseFloat(document.getElementById('raw-area').value);
    const unit = document.getElementById('raw-unit').value;

    // Validation
    if (!area) {
        showToast('Please enter area');
        return;
    }

    // Convert to sqft if needed
    let areaSqft = area;
    if (unit === 'sqyd') {
        areaSqft = area * 9; // 1 sq.yd = 9 sq.ft
    }

    // Calculate per 100 sqft
    const factor = areaSqft / 100;

    // Material quantities per 100 sqft
    const cementBags = 8 * factor;
    const sandTons = 1.2 * factor;
    const aggregateTons = 1.5 * factor;
    const bricks = 800 * factor;
    const steelKg = 40 * factor;

    // Get pricing (using default Tamil Nadu pricing)
    const pricing = pricingData['tamil-nadu']['default'];

    // Calculate costs
    const cementCost = cementBags * pricing.cement;
    const sandCost = sandTons * pricing.sand * 1000;
    const aggregateCost = aggregateTons * pricing.aggregate * 1000;
    const bricksCost = bricks * pricing.bricks;
    const steelCost = steelKg * pricing.steel;
    const totalCost = cementCost + sandCost + aggregateCost + bricksCost + steelCost;

    // Display results
    const resultDiv = document.getElementById('raw-result');
    resultDiv.innerHTML = `
        <h4><i class="fas fa-check-circle"></i> Material Requirements</h4>
        <div class="result-item">
            <span class="result-label">Cement</span>
            <span class="result-value">${formatNumber(cementBags)} bags</span>
        </div>
        <div class="result-item">
            <span class="result-label">Sand</span>
            <span class="result-value">${formatNumber(sandTons)} tons</span>
        </div>
        <div class="result-item">
            <span class="result-label">Aggregate</span>
            <span class="result-value">${formatNumber(aggregateTons)} tons</span>
        </div>
        <div class="result-item">
            <span class="result-label">Bricks</span>
            <span class="result-value">${formatNumber(bricks, 0)} nos</span>
        </div>
        <div class="result-item">
            <span class="result-label">Steel</span>
            <span class="result-value">${formatNumber(steelKg)} kg</span>
        </div>
        <div class="result-item">
            <span class="result-label">Total Cost</span>
            <span class="result-value">${formatCurrency(totalCost)}</span>
        </div>
        <p style="margin-top: 10px; font-size: 0.875rem; color: var(--text-secondary);">
            <i class="fas fa-info-circle"></i> For ${formatNumber(areaSqft, 0)} sq.ft
        </p>
    `;
    resultDiv.classList.add('show');
}

// ===================================
// 4. PAINTS CALCULATOR
// ===================================

async function calculatePaint() {
    const height = parseFloat(document.getElementById('wall-height').value);
    const width = parseFloat(document.getElementById('wall-width').value);
    const doorCount = parseInt(document.getElementById('door-count').value) || 0;
    const doorDimensions = document.getElementById('door-dimensions').value;
    const windowCount = parseInt(document.getElementById('window-count').value) || 0;
    const windowDimensions = document.getElementById('window-dimensions').value;
    const resultDiv = document.getElementById('paint-result');

    // Validation
    if (!height || !width) {
        showToast('Please enter wall dimensions');
        return;
    }

    try {
        // Show loading
        resultDiv.innerHTML = '<div style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary-color);"></i><p>Calculating...</p></div>';
        resultDiv.classList.add('show');

        // Calculate wall area
        const wallArea = height * width;

        // Parse door dimensions
        const doorParts = doorDimensions.split('x').map(d => parseFloat(d.trim()));
        const doorArea = doorCount * (doorParts[0] || 7) * (doorParts[1] || 3);

        // Parse window dimensions
        const windowParts = windowDimensions.split('x').map(d => parseFloat(d.trim()));
        const windowArea = windowCount * (windowParts[0] || 4) * (windowParts[1] || 3);

        // Calculate paintable area
        const paintableArea = wallArea - doorArea - windowArea;

        if (paintableArea <= 0) {
            showToast('Paintable area cannot be negative');
            return;
        }

        const response = await api.calculatePaint(paintableArea, 2, 'emulsion');

        resultDiv.innerHTML = `
            <h4><i class="fas fa-check-circle"></i> Paint Requirements</h4>
            <div class="result-item">
                <span class="result-label">Paintable Area</span>
                <span class="result-value">${formatNumber(response.area)} sq.ft</span>
            </div>
            <div class="result-item">
                <span class="result-label">Paint Required</span>
                <span class="result-value">${formatNumber(response.paint_liters)} liters</span>
            </div>
            <div class="result-item">
                <span class="result-label">Paint Cost</span>
                <span class="result-value">${formatCurrency(response.paint_cost)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Labor Cost</span>
                <span class="result-value">${formatCurrency(response.labor_cost)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Cost</span>
                <span class="result-value">${formatCurrency(response.total_cost)}</span>
            </div>
            <p style="margin-top: 10px; font-size: 0.875rem; color: var(--text-secondary);">
                <i class="fas fa-info-circle"></i> ${response.coats} coats, ${response.paint_type}
            </p>
        `;
    } catch (error) {
        resultDiv.innerHTML = `
            <div style="color: #dc3545; text-align: center; padding: 20px;">
                <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <p>${error.message || 'Calculation failed'}</p>
            </div>
        `;
        showToast('Calculation failed. Please try again.');
    }
}

// ===================================
// 5. READY MIX CALCULATOR
// ===================================

function calculateReadyMix() {
    const height = parseFloat(document.getElementById('rmc-height').value);
    const width = parseFloat(document.getElementById('rmc-width').value);
    const depth = parseFloat(document.getElementById('rmc-depth').value);

    // Validation
    if (!height || !width || !depth) {
        showToast('Please enter all dimensions');
        return;
    }

    // Calculate volume in cubic meters
    const volumeM3 = height * width * depth;

    // Convert to cubic yards
    const volumeYards = volumeM3 * 1.30795;

    // Get pricing (using default Tamil Nadu pricing)
    const pricing = pricingData['tamil-nadu']['default'];

    // Calculate cost
    const totalCost = volumeM3 * pricing.rmc;

    // Display results
    const resultDiv = document.getElementById('rmc-result');
    resultDiv.innerHTML = `
        <h4><i class="fas fa-check-circle"></i> Ready Mix Concrete</h4>
        <div class="result-item">
            <span class="result-label">Volume (m³)</span>
            <span class="result-value">${formatNumber(volumeM3)} m³</span>
        </div>
        <div class="result-item">
            <span class="result-label">Volume (cubic yards)</span>
            <span class="result-value">${formatNumber(volumeYards)} yd³</span>
        </div>
        <div class="result-item">
            <span class="result-label">Total Cost</span>
            <span class="result-value">${formatCurrency(totalCost)}</span>
        </div>
        <p style="margin-top: 10px; font-size: 0.875rem; color: var(--text-secondary);">
            <i class="fas fa-info-circle"></i> Rate: ${formatCurrency(pricing.rmc)}/m³
        </p>
    `;
    resultDiv.classList.add('show');
}

// Make functions globally available
window.calculateConstructionCost = calculateConstructionCost;
window.calculateConcrete = calculateConcrete;
window.calculateRawMaterial = calculateRawMaterial;
window.calculatePaint = calculatePaint;
window.calculateReadyMix = calculateReadyMix;
