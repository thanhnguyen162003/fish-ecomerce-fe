// useWishlist.ts
import { useState } from 'react';
import { ExProductType } from '@/type/ExProductType';

interface WishlistItem {
    product: Array<ExProductType>
}

const useWishlist = () => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

    const addToWishlist = (product: Array<ExProductType>) => {
        const newItem: WishlistItem = {
            product,
        };
        setWishlist((prevWishlist) => [...prevWishlist, newItem]);
    };

    const removeFromWishlist = (productId: string) => {
        setWishlist((prevWishlist) =>
            prevWishlist.map(item => ({
                product: item.product.filter(prd => prd.id !== productId)
            }))
        );
    };

    return {
        wishlist,
        addToWishlist,
        removeFromWishlist,
    };
};

export default useWishlist;
