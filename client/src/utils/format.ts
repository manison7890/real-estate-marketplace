export const formatPrice = (price: number, listingType?: string): string => {
  if (!price && price !== 0) return 'Price on Request';

  if (listingType === 'rent') {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2).replace(/\.00$/, '')} L / mo`;
    }
    return `₹${price.toLocaleString('en-IN')} / mo`;
  }

  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2).replace(/\.00$/, '')} L`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
};

export const formatArea = (sqft: number): string => {
  if (!sqft) return 'N/A';
  return `${sqft.toLocaleString('en-IN')} sq.ft`;
};
