/**
 *
 * @param {Array<{ unitPriceCents: number, quantity: number }>} items
 * @returns {number}
 * @throws {TypeError|RangeError}
 */
export function calculateTotalCents(items) {
  if (!Array.isArray(items)) {
    throw new TypeError('Expected items to be an array');
  }

  let totalCents = 0;

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];

    if (typeof item !== 'object' || item === null) {
      throw new TypeError(`Item at index ${i} must be a non-null object`);
    }

    const { unitPriceCents, quantity } = item;

    if (!Number.isSafeInteger(unitPriceCents)) {
      throw new TypeError(
        `Item at index ${i}: unitPriceCents must be a safe integer`,
      );
    }
    if (unitPriceCents < 0) {
      throw new RangeError(
        `Item at index ${i}: unitPriceCents cannot be negative`,
      );
    }

    if (!Number.isSafeInteger(quantity)) {
      throw new TypeError(
        `Item at index ${i}: quantity must be a safe integer`,
      );
    }
    if (quantity < 0) {
      throw new RangeError(`Item at index ${i}: quantity cannot be negative`);
    }

    const lineSubtotal = unitPriceCents * quantity;
    if (!Number.isSafeInteger(lineSubtotal)) {
      throw new RangeError(
        `Item at index ${i}: subtotal exceeds MAX_SAFE_INTEGER`,
      );
    }

    if (Number.MAX_SAFE_INTEGER - totalCents < lineSubtotal) {
      throw new RangeError('Total sum exceeds MAX_SAFE_INTEGER');
    }

    totalCents += lineSubtotal;
  }

  return totalCents;
}
