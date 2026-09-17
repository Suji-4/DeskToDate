const WISHLIST_KEY = "d2d_wishlist";
export const getWishlist = () => {
  const savedWishlist = localStorage.getItem(WISHLIST_KEY);
  return savedWishlist ? JSON.parse(savedWishlist) : [];
};

export const isInWishlist = (productId) => {
  const wishlist = getWishlist();
  return wishlist.some(
    (product) => String(product.id) === String(productId)
  );
};

export const addToWishlist = (product) => {
  const wishlist = getWishlist();

  const alreadyExists = wishlist.some(
    (item) => String(item.id) === String(product.id)
  );

  if (alreadyExists) {
    return wishlist;
  }

  const updatedWishlist = [...wishlist, product];

  localStorage.setItem(
    WISHLIST_KEY,
    JSON.stringify(updatedWishlist)
  );

  return updatedWishlist;
};

export const removeFromWishlist = (productId) => {
  const wishlist = getWishlist();

  const updatedWishlist = wishlist.filter(
    (product) => String(product.id) !== String(productId)
  );

  localStorage.setItem(
    WISHLIST_KEY,
    JSON.stringify(updatedWishlist)
  );

  return updatedWishlist;
};

export const toggleWishlist = (product) => {
  if (isInWishlist(product.id)) {
    return removeFromWishlist(product.id);
  }

  return addToWishlist(product);
};

export const getWishlistCount = () => {
  return getWishlist().length;
};

