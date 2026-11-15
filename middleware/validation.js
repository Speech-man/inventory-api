xport function validateProduct(req, res, next) {
    const { name, quantity, price, lowStockthreshold } = req.body;
    const errors = [];
// Check name (must be a non empty string)
if (!name || typeof name !=='string' || name.trim() === '')
    errors.push('Name is required and must be a non empty string.');
}

// Check quantity (must be a whole number >= 0)
if (quantity === undefined || !Number.isInterger(quantity) || quantity < 0) {
    errors.push('Quantity is required and must be an integer of 0 or greater.');
}

// Check price (must be a number >= 0)
if (price === undefined || typeof price !== 'number' || Number.isNaN(price) || price < 0){
    errors.push('Price is required and must be a number of 0 or greater.');
}

// Check lowstockThreshold if the user included it
if (lowStockThreshold !== undefined) {
    if (!Number.isInteger(lowStockThreshold) || lowStockThreshold < 0) {
        errors.push('Low stockThreshold must be an integer of 0 or greater.');
    }
    }
if (errors.length > 0) {
    return res.status(400).json({ errors});
}

next();


    
