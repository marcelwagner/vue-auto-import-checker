import { logger } from "../utils/index.js";
export function writeComponents(componentsList) {
    if (componentsList.length >= 1) {
        logger.info('');
        logger.info(`Found component${componentsList.length >= 2 ? 's' : ''}:`);
        logger.info('');
        componentsList.forEach((component) => {
            logger.info(component);
        });
        logger.info('');
        logger.info(`Total : ${componentsList.length}`);
        logger.info('');
    }
    else {
        logger.info('No components found.');
    }
}
