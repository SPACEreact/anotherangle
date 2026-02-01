import { useCallback } from 'react';
import { useSceneStore } from '../stores/useSceneStore';
import { useUIStore } from '../stores/useUIStore';

/**
 * Hook to handle image upload for character reference
 */
export function useImageUpload() {
    const setCharSheet = useSceneStore((state) => state.setCharSheet);
    const addNotification = useUIStore((state) => state.addNotification);

    const handleUpload = useCallback((file: File | null) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            addNotification('Please upload an image file', 'error');
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            addNotification('Image size must be less than 10MB', 'error');
            return;
        }

        // Create URL for preview
        const url = URL.createObjectURL(file);
        setCharSheet(url);
        addNotification('Character reference uploaded', 'success');
    }, [setCharSheet, addNotification]);

    const clearImage = useCallback(() => {
        setCharSheet(null);
        addNotification('Character reference removed', 'info');
    }, [setCharSheet, addNotification]);

    return { handleUpload, clearImage };
}
