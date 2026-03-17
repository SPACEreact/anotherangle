import { useCallback } from 'react';
import { useUIStore } from '../stores/useUIStore';

/**
 * Deprecated: image upload is removed in the current streamlined app.
 */
export function useImageUpload() {
    const addNotification = useUIStore((state) => state.addNotification);

    const handleUpload = useCallback(() => {
        addNotification('Image upload is disabled in this version.', 'info');
    }, [addNotification]);

    const clearImage = useCallback(() => {
        addNotification('No image to clear.', 'info');
    }, [addNotification]);

    return { handleUpload, clearImage };
}
