// Import stylesheets
import './style.css';
import Bootstrapper from './core/bootstrapper';
import App from './app';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');

const bootstrapper = new Bootstrapper();
const app = new App();
bootstrapper.start(appDiv, app);