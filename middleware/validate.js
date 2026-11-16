function checkFields(body, requireAll) {
  const errors = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return ['Request body must be a JSON object'];
  }

  // Ensure update requests contain at least one field
  if (!requireAll && Object.keys(body).length === 0) {
    errors.push('At least one field must be provided for update');
  }


  if (body.name === undefined) {
    if (requireAll) errors.push('name is required');
  } else if (typeof body.name !== 'string' || body.name.trim() === '') {
    errors.push('name must be a non-empty string');
  }

  
  if (body.category === undefined) {
    if (requireAll) errors.push('category is required');
  } else if (typeof body.category !== 'string' || body.category.trim() === '') {
    errors.push('category must be a non-empty string');
  }

 
  if (body.quantity === undefined) {
    if (requireAll) errors.push('quantity is required');
  } else if (!Number.isInteger(body.quantity) || body.quantity < 0) {
    errors.push('quantity must be a whole number, 0 or more');
  }

  
  if (body.price === undefined) {
    if (requireAll) errors.push('price is required');
  } else if (typeof body.price !== 'number' || body.price < 0) {
    errors.push('price must be a number, 0 or more');
  }

  
  if (
    body.lowStockThreshold !== undefined &&
    (!Number.isInteger(body.lowStockThreshold) || body.lowStockThreshold < 0)
  ) {
    errors.push('lowStockThreshold must be a whole number, 0 or more');
  }

  return errors;
}


export function validateCreate(req, res, next) {
  const errors = checkFields(req.body, true);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  next();
}


export function validateUpdate(req, res, next) {
  const errors = checkFields(req.body, false);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  next();
}