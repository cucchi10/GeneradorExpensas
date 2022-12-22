import { createApp } from 'vue'
import App from './App.vue'

import Toaster from '@meforma/vue-toaster';

import { library } from '@fortawesome/fontawesome-svg-core'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faTrash, faFloppyDisk, faPlus} from '@fortawesome/free-solid-svg-icons'

library.add(faTrash,faFloppyDisk,faPlus)

import "./assets/scss/style.scss";

createApp(App)
.use(Toaster)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')


import "bootstrap/dist/js/bootstrap.js";