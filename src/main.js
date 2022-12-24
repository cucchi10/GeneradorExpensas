import { createApp } from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faTrash, faFloppyDisk, faPlus, faFilePdf, faCalculator, faFolderOpen, faDownload} from '@fortawesome/free-solid-svg-icons'

library.add(faTrash,faFloppyDisk,faPlus, faFilePdf, faCalculator, faFolderOpen, faDownload)

import "./assets/scss/style.scss";

createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')


import "bootstrap/dist/js/bootstrap.js";