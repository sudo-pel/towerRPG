import { skills } from './skills';
import { Combat } from './combat';
import * as mainView from '../views/mainView';
import { enemiesDirectory , modeDirectory, aiDirectory } from '../../directories/enemies/enemies';

export const enemies = enemiesDirectory;

export const ai = aiDirectory;

export const mode = modeDirectory;

export const getEnemy = enemy => {
    return enemies[enemy];
}
