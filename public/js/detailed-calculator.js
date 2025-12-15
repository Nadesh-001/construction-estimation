// ===================================
// DETAILED CALCULATOR
// ===================================

// Quality-based pricing per sqft
const qualityPricing = {
    'normal': 1200,
    'standard': 1500,
    'high-end': 2000,
    'luxury': 2500
};

// Material unit prices
const detailedPricing = {
    steel: 65,      // per kg
    cement: 400,    // per bag
    bricks: 8,      // per piece
    stone: 2500,    // per ton
    sand: 50,       // per ton
    water: 0.5      // per liter
};

// Store calculated values
let calculatedArea = 0;
let calculatedCost = 0;
let currentQuality = 'normal';

// ===================================
// AREA CALCULATION
// ===================================

function calculateTotalArea() {
    const width = parseFloat(document.getElementById('plot-width').value);
    const length = parseFloat(document.getElementById('plot-length').value);
    const floors = parseInt(document.getElementById('plot-floors').value) || 1;

    if (!width || !length) {
        showToast('Please enter plot dimensions');
        return;
    }

    calculatedArea = width * length * floors;
    showToast(`Total Construction Area: ${formatNumber(calculatedArea, 0)} sq.ft`);
}

// ===================================
// TOTAL COST CALCULATION
// ===================================

function calculateTotalCost() {
    if (calculatedArea === 0) {
        showToast('Please calculate total area first');
        return;
    }

    currentQuality = document.getElementById('quality-selector').value;
    const ratePerSqft = qualityPricing[currentQuality];
    calculatedCost = calculatedArea * ratePerSqft;

    showToast(`Total Construction Cost: ${formatCurrency(calculatedCost)}`);

    // Auto-fill material quantities based on area
    autoFillMaterials();
}

// ===================================
// AUTO-FILL MATERIALS
// ===================================

function autoFillMaterials() {
    // Calculate material quantities based on area
    const factor = calculatedArea / 1000; // per 1000 sqft

    // Material quantities
    const steel = Math.round(4000 * factor); // 4000 kg per 1000 sqft
    const cement = Math.round(400 * factor); // 400 bags per 1000 sqft
    const bricks = Math.round(8000 * factor); // 8000 bricks per 1000 sqft
    const stone = Math.round(15 * factor); // 15 tons per 1000 sqft
    const sand = Math.round(12 * factor); // 12 tons per 1000 sqft
    const water = Math.round(5000 * factor); // 5000 liters per 1000 sqft

    // Fill inputs
    document.getElementById('cost-steel').value = steel;
    document.getElementById('cost-cement').value = cement;
    document.getElementById('cost-bricks').value = bricks;
    document.getElementById('cost-stone').value = stone;
    document.getElementById('cost-sand').value = sand;
    document.getElementById('cost-water').value = water;

    // Calculate and display values
    updateCostValue('steel', steel * detailedPricing.steel);
    updateCostValue('cement', cement * detailedPricing.cement);
    updateCostValue('bricks', bricks * detailedPricing.bricks);
    updateCostValue('stone', stone * detailedPricing.stone);
    updateCostValue('sand', sand * detailedPricing.sand);
    updateCostValue('water', water * detailedPricing.water);

    // Auto-fill labor costs (percentage of total cost)
    const excavation = Math.round(calculatedCost * 0.05);
    const labor = Math.round(calculatedCost * 0.25);
    const design = Math.round(calculatedCost * 0.03);
    const doors = Math.round(calculatedCost * 0.08);
    const shuttering = Math.round(calculatedCost * 0.06);
    const plumbing = Math.round(calculatedCost * 0.07);
    const electrical = Math.round(calculatedCost * 0.08);
    const flooring = Math.round(calculatedCost * 0.10);
    const painting = Math.round(calculatedCost * 0.05);
    const boundary = Math.round(calculatedCost * 0.04);
    const other = Math.round(calculatedCost * 0.02);

    document.getElementById('cost-excavation').value = excavation;
    document.getElementById('cost-labor').value = labor;
    document.getElementById('cost-design').value = design;
    document.getElementById('cost-doors').value = doors;
    document.getElementById('cost-shuttering').value = shuttering;
    document.getElementById('cost-plumbing').value = plumbing;
    document.getElementById('cost-electrical').value = electrical;
    document.getElementById('cost-flooring').value = flooring;
    document.getElementById('cost-painting').value = painting;
    document.getElementById('cost-boundary').value = boundary;
    document.getElementById('cost-other').value = other;

    updateCostValue('excavation', excavation);
    updateCostValue('labor', labor);
    updateCostValue('design', design);
    updateCostValue('doors', doors);
    updateCostValue('shuttering', shuttering);
    updateCostValue('plumbing', plumbing);
    updateCostValue('electrical', electrical);
    updateCostValue('flooring', flooring);
    updateCostValue('painting', painting);
    updateCostValue('boundary', boundary);
    updateCostValue('other', other);

    // Highlight auto-calculated items
    document.querySelectorAll('.cost-item').forEach(item => {
        item.classList.add('auto-calculated');
        setTimeout(() => item.classList.remove('auto-calculated'), 1000);
    });
}

// ===================================
// UPDATE COST VALUE
// ===================================

function updateCostValue(id, value) {
    const element = document.getElementById(`value-${id}`);
    if (element) {
        element.textContent = formatCurrency(value);
    }
}

// ===================================
// CALCULATE ALL COSTS
// ===================================

function calculateAllCosts() {
    // Get all material quantities
    const steel = parseFloat(document.getElementById('cost-steel').value) || 0;
    const cement = parseFloat(document.getElementById('cost-cement').value) || 0;
    const bricks = parseFloat(document.getElementById('cost-bricks').value) || 0;
    const stone = parseFloat(document.getElementById('cost-stone').value) || 0;
    const sand = parseFloat(document.getElementById('cost-sand').value) || 0;
    const water = parseFloat(document.getElementById('cost-water').value) || 0;

    // Get all labor costs
    const excavation = parseFloat(document.getElementById('cost-excavation').value) || 0;
    const labor = parseFloat(document.getElementById('cost-labor').value) || 0;
    const design = parseFloat(document.getElementById('cost-design').value) || 0;
    const doors = parseFloat(document.getElementById('cost-doors').value) || 0;
    const shuttering = parseFloat(document.getElementById('cost-shuttering').value) || 0;
    const plumbing = parseFloat(document.getElementById('cost-plumbing').value) || 0;
    const electrical = parseFloat(document.getElementById('cost-electrical').value) || 0;
    const flooring = parseFloat(document.getElementById('cost-flooring').value) || 0;
    const painting = parseFloat(document.getElementById('cost-painting').value) || 0;
    const boundary = parseFloat(document.getElementById('cost-boundary').value) || 0;
    const other = parseFloat(document.getElementById('cost-other').value) || 0;

    // Calculate material costs
    const steelCost = steel * detailedPricing.steel;
    const cementCost = cement * detailedPricing.cement;
    const bricksCost = bricks * detailedPricing.bricks;
    const stoneCost = stone * detailedPricing.stone;
    const sandCost = sand * detailedPricing.sand;
    const waterCost = water * detailedPricing.water;

    const totalMaterialCost = steelCost + cementCost + bricksCost + stoneCost + sandCost + waterCost;
    const totalLaborCost = excavation + labor + design + doors + shuttering + plumbing + electrical + flooring + painting + boundary + other;
    const grandTotal = totalMaterialCost + totalLaborCost;

    // Update display values
    updateCostValue('steel', steelCost);
    updateCostValue('cement', cementCost);
    updateCostValue('bricks', bricksCost);
    updateCostValue('stone', stoneCost);
    updateCostValue('sand', sandCost);
    updateCostValue('water', waterCost);

    updateCostValue('excavation', excavation);
    updateCostValue('labor', labor);
    updateCostValue('design', design);
    updateCostValue('doors', doors);
    updateCostValue('shuttering', shuttering);
    updateCostValue('plumbing', plumbing);
    updateCostValue('electrical', electrical);
    updateCostValue('flooring', flooring);
    updateCostValue('painting', painting);
    updateCostValue('boundary', boundary);
    updateCostValue('other', other);

    // Generate summary
    generateSummary({
        materials: {
            steel: { qty: steel, cost: steelCost },
            cement: { qty: cement, cost: cementCost },
            bricks: { qty: bricks, cost: bricksCost },
            stone: { qty: stone, cost: stoneCost },
            sand: { qty: sand, cost: sandCost },
            water: { qty: water, cost: waterCost }
        },
        labor: {
            excavation, labor, design, doors, shuttering,
            plumbing, electrical, flooring, painting, boundary, other
        },
        totals: {
            materialCost: totalMaterialCost,
            laborCost: totalLaborCost,
            grandTotal: grandTotal
        }
    });
}

// ===================================
// GENERATE SUMMARY
// ===================================

function generateSummary(data) {
    const width = document.getElementById('plot-width').value;
    const length = document.getElementById('plot-length').value;
    const floors = document.getElementById('plot-floors').value;
    const quality = document.getElementById('quality-selector').selectedOptions[0].text;

    const summaryContent = document.getElementById('summary-content');
    summaryContent.innerHTML = `
        <div class="project-details">
            <h4>Project Details</h4>
            <div class="detail-row">
                <span class="detail-label">Quality:</span>
                <span class="detail-value">${quality}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Plot Size:</span>
                <span class="detail-value">${width} x ${length} ft</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Floors:</span>
                <span class="detail-value">${floors}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Total Area:</span>
                <span class="detail-value">${formatNumber(calculatedArea, 0)} sq.ft</span>
            </div>
        </div>
        
        <div class="summary-section">
            <h4>Material Costs</h4>
            <div class="summary-row">
                <span class="summary-label">Steel (${formatNumber(data.materials.steel.qty)} kg)</span>
                <span class="summary-value">${formatCurrency(data.materials.steel.cost)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Cement (${formatNumber(data.materials.cement.qty)} bags)</span>
                <span class="summary-value">${formatCurrency(data.materials.cement.cost)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Bricks (${formatNumber(data.materials.bricks.qty, 0)} nos)</span>
                <span class="summary-value">${formatCurrency(data.materials.bricks.cost)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Stone (${formatNumber(data.materials.stone.qty)} tons)</span>
                <span class="summary-value">${formatCurrency(data.materials.stone.cost)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Sand (${formatNumber(data.materials.sand.qty)} tons)</span>
                <span class="summary-value">${formatCurrency(data.materials.sand.cost)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Water (${formatNumber(data.materials.water.qty, 0)} liters)</span>
                <span class="summary-value">${formatCurrency(data.materials.water.cost)}</span>
            </div>
            <div class="summary-row" style="font-weight: 600; border-top: 2px solid var(--border-color); padding-top: 10px; margin-top: 10px;">
                <span class="summary-label">Total Material Cost</span>
                <span class="summary-value">${formatCurrency(data.totals.materialCost)}</span>
            </div>
        </div>
        
        <div class="summary-section">
            <h4>Labor & Other Costs</h4>
            <div class="summary-row">
                <span class="summary-label">Excavation</span>
                <span class="summary-value">${formatCurrency(data.labor.excavation)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Labor</span>
                <span class="summary-value">${formatCurrency(data.labor.labor)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Design Fee</span>
                <span class="summary-value">${formatCurrency(data.labor.design)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Doors/Windows</span>
                <span class="summary-value">${formatCurrency(data.labor.doors)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Shuttering</span>
                <span class="summary-value">${formatCurrency(data.labor.shuttering)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Plumbing</span>
                <span class="summary-value">${formatCurrency(data.labor.plumbing)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Electrical</span>
                <span class="summary-value">${formatCurrency(data.labor.electrical)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Flooring</span>
                <span class="summary-value">${formatCurrency(data.labor.flooring)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Painting</span>
                <span class="summary-value">${formatCurrency(data.labor.painting)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Boundary Wall</span>
                <span class="summary-value">${formatCurrency(data.labor.boundary)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Other</span>
                <span class="summary-value">${formatCurrency(data.labor.other)}</span>
            </div>
            <div class="summary-row" style="font-weight: 600; border-top: 2px solid var(--border-color); padding-top: 10px; margin-top: 10px;">
                <span class="summary-label">Total Labor Cost</span>
                <span class="summary-value">${formatCurrency(data.totals.laborCost)}</span>
            </div>
        </div>
        
        <div class="grand-total">
            <div class="label">GRAND TOTAL</div>
            <div class="value">${formatCurrency(data.totals.grandTotal)}</div>
        </div>
        
        <div class="date-stamp">
            Generated on ${new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}
        </div>
    `;

    // Show summary section
    document.getElementById('calc-summary').style.display = 'block';

    // Scroll to summary
    document.getElementById('calc-summary').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===================================
// PDF EXPORT
// ===================================

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(255, 140, 0);
    doc.text('Construction Cost Estimate', 105, 20, { align: 'center' });

    // Add company name
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Arun Architecture & Constructions', 105, 30, { align: 'center' });

    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 105, 38, { align: 'center' });

    // Get summary content
    const summaryDiv = document.getElementById('summary-content');
    const sections = summaryDiv.querySelectorAll('.summary-section, .project-details');

    let yPos = 50;

    // Add content
    sections.forEach(section => {
        const title = section.querySelector('h4');
        if (title) {
            doc.setFontSize(14);
            doc.setTextColor(255, 140, 0);
            doc.text(title.textContent, 20, yPos);
            yPos += 8;
        }

        const rows = section.querySelectorAll('.summary-row, .detail-row');
        rows.forEach(row => {
            const label = row.querySelector('.summary-label, .detail-label');
            const value = row.querySelector('.summary-value, .detail-value');

            if (label && value) {
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                doc.text(label.textContent, 25, yPos);
                doc.text(value.textContent, 180, yPos, { align: 'right' });
                yPos += 6;
            }
        });

        yPos += 5;

        // Add new page if needed
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
    });

    // Add grand total
    const grandTotal = document.querySelector('.grand-total .value');
    if (grandTotal) {
        doc.setFontSize(16);
        doc.setTextColor(255, 140, 0);
        doc.text('GRAND TOTAL', 20, yPos);
        doc.text(grandTotal.textContent, 180, yPos, { align: 'right' });
    }

    // Save PDF
    const filename = `Construction_Estimate_${new Date().getTime()}.pdf`;
    doc.save(filename);

    showToast('PDF downloaded successfully!');
}

// Setup input listeners for real-time calculation
document.addEventListener('DOMContentLoaded', () => {
    // Add input listeners for material costs
    const materialInputs = ['steel', 'cement', 'bricks', 'stone', 'sand', 'water'];
    materialInputs.forEach(id => {
        const input = document.getElementById(`cost-${id}`);
        if (input) {
            input.addEventListener('input', (e) => {
                const qty = parseFloat(e.target.value) || 0;
                const cost = qty * detailedPricing[id];
                updateCostValue(id, cost);
            });
        }
    });

    // Add input listeners for labor costs
    const laborInputs = ['excavation', 'labor', 'design', 'doors', 'shuttering',
        'plumbing', 'electrical', 'flooring', 'painting', 'boundary', 'other'];
    laborInputs.forEach(id => {
        const input = document.getElementById(`cost-${id}`);
        if (input) {
            input.addEventListener('input', (e) => {
                const amount = parseFloat(e.target.value) || 0;
                updateCostValue(id, amount);
            });
        }
    });
});

// Make functions globally available
window.calculateTotalArea = calculateTotalArea;
window.calculateTotalCost = calculateTotalCost;
window.calculateAllCosts = calculateAllCosts;
window.exportToPDF = exportToPDF;
