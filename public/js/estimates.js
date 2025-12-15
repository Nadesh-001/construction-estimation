/**
 * Estimate Management Module
 * Handles saving, loading, and managing construction estimates
 */

// Current estimate data
let currentEstimate = null;

// ===================================
// SAVE ESTIMATE
// ===================================

async function saveEstimate(estimateData) {
    if (!api.isAuthenticated()) {
        showToast('Please login to save estimates');
        openModal('login-modal');
        return;
    }

    try {
        const response = await api.saveEstimate(estimateData);
        showToast('Estimate saved successfully!');
        currentEstimate = response.estimate;
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to save estimate');
        throw error;
    }
}

// ===================================
// LOAD ESTIMATES
// ===================================

async function loadEstimates() {
    if (!api.isAuthenticated()) {
        showToast('Please login to view estimates');
        return [];
    }

    try {
        const response = await api.getEstimates();
        return response.estimates || [];
    } catch (error) {
        showToast('Failed to load estimates');
        return [];
    }
}

// ===================================
// DELETE ESTIMATE
// ===================================

async function deleteEstimate(estimateId) {
    if (!confirm('Are you sure you want to delete this estimate?')) {
        return;
    }

    try {
        await api.deleteEstimate(estimateId);
        showToast('Estimate deleted successfully');
        await showEstimatesModal();
    } catch (error) {
        showToast(error.message || 'Failed to delete estimate');
    }
}

// ===================================
// SHOW ESTIMATES MODAL
// ===================================

async function showEstimatesModal() {
    const estimates = await loadEstimates();
    const modal = document.getElementById('estimates-modal');
    const list = document.getElementById('estimates-list');

    if (estimates.length === 0) {
        list.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <p>No saved estimates yet</p>
                <p style="font-size: 0.875rem;">Use any calculator and click "Save Estimate" to get started</p>
            </div>
        `;
    } else {
        list.innerHTML = estimates.map(estimate => `
            <div class="estimate-item">
                <div class="estimate-header">
                    <h4>${estimate.project_name || 'Untitled Project'}</h4>
                    <span class="estimate-date">${new Date(estimate.created_at).toLocaleDateString('en-IN')}</span>
                </div>
                <div class="estimate-details">
                    <div class="estimate-detail">
                        <i class="fas fa-ruler-combined"></i>
                        <span>${formatNumber(estimate.total_area, 0)} sq.ft</span>
                    </div>
                    <div class="estimate-detail">
                        <i class="fas fa-building"></i>
                        <span>${estimate.num_floors} floor(s)</span>
                    </div>
                    <div class="estimate-detail">
                        <i class="fas fa-star"></i>
                        <span>${estimate.material_quality}</span>
                    </div>
                </div>
                <div class="estimate-cost">
                    <span class="cost-label">Total Cost:</span>
                    <span class="cost-value">${formatCurrency(estimate.total_cost)}</span>
                    <span class="cost-per-sqft">(${formatCurrency(estimate.cost_per_sqft)}/sq.ft)</span>
                </div>
                <div class="estimate-actions">
                    <button class="btn btn-sm btn-secondary" onclick="loadEstimateDetails(${estimate.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="deleteEstimate(${estimate.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    openModal('estimates-modal');
}

// ===================================
// LOAD ESTIMATE DETAILS
// ===================================

async function loadEstimateDetails(estimateId) {
    try {
        const response = await api.getEstimate(estimateId);
        const estimate = response.estimate;

        // Display estimate details
        alert(`
Project: ${estimate.project_name}
Area: ${estimate.total_area} sq.ft
Floors: ${estimate.num_floors}
Quality: ${estimate.material_quality}
Total Cost: ${formatCurrency(estimate.total_cost)}
Cost per sq.ft: ${formatCurrency(estimate.cost_per_sqft)}
        `);

        // TODO: Populate calculator with estimate data
    } catch (error) {
        showToast('Failed to load estimate details');
    }
}

// ===================================
// SAVE FROM CALCULATOR
// ===================================

async function saveFromCalculator(calculatorType, data) {
    const projectName = prompt('Enter project name:');
    if (!projectName) return;

    const estimateData = {
        project_name: projectName,
        plot_length: data.length || 0,
        plot_breadth: data.breadth || 0,
        total_area: data.total_area || 0,
        num_floors: data.num_floors || 1,
        material_quality: data.quality || 'standard',
        total_cost: data.total_cost || 0,
        cost_per_sqft: data.cost_per_sqft || 0,
        estimate_data: JSON.stringify(data)
    };

    await saveEstimate(estimateData);
}

// Make functions globally available
window.saveEstimate = saveEstimate;
window.loadEstimates = loadEstimates;
window.deleteEstimate = deleteEstimate;
window.showEstimatesModal = showEstimatesModal;
window.loadEstimateDetails = loadEstimateDetails;
window.saveFromCalculator = saveFromCalculator;
