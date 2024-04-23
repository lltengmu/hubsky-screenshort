class ImageService {
    generateImage(source: string): Promise<HTMLImageElement> {
        return new Promise(resolve => {
            const img = new Image();
            img.src = source;
            img.onload = () => {
                resolve(img)
            }
        })
    }
}

export default new ImageService()