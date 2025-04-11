import { createApp, markRaw, defineAsyncComponent } from 'vue'
import { plugin, defaultConfig } from '@formkit/vue'
import config from './formkit.config.js'
import '@formkit/themes/genesis'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-blue/theme.css'
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';
import Button from "primevue/button"
import InputText from 'primevue/inputtext'
import InputSwitch from 'primevue/inputswitch'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import ToggleButton from 'primevue/togglebutton';
//import ToggleSwitch from 'primevue/toggleswitch';
import ConfirmPopup from 'primevue/confirmpopup';
import ButtonGroup from 'primevue/buttongroup';
import DynamicDialog from 'primevue/dynamicdialog';
import FloatLabel from 'primevue/floatlabel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Dropdown from 'primevue/dropdown';
import Listbox from 'primevue/listbox';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import ScrollPanel from 'primevue/scrollpanel';
import RadioButton from 'primevue/radiobutton';
import Checkbox from 'primevue/checkbox';
import Toolbar from 'primevue/toolbar';
import Fieldset from 'primevue/fieldset';
import Card from 'primevue/card';
import Editor from 'primevue/editor';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Chart from 'primevue/chart';
import Steps from 'primevue/steps';
import Rating from 'primevue/rating';
import Tag from 'primevue/tag';
import Slider from 'primevue/slider';
import Menu from 'primevue/menu';
import SelectButton from 'primevue/selectbutton';

import TestcaseList from './components/TestcaseList.vue'
import Testcase from './components/Testcase.vue'
import RuleList from './components/RuleList.vue'
import Rule from './components/Rule.vue'
import EditorAdmin from './components/EditorAdmin.vue'

const app = createApp(App);
app.use(PrimeVue, {
    unstyled: false
});
app.use(ConfirmationService);
app.use(DialogService);
app.use(plugin, defaultConfig(config))
app.component('Button', Button);
app.component('ButtonGroup', ButtonGroup);
app.component('InputText', InputText);
app.component('Textarea', Textarea);
app.component('ToggleButton', ToggleButton);
app.component('ConfirmPopup', ConfirmPopup);
app.component('DynamicDialog', DynamicDialog);
app.component('Toast', Toast);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.component('FloatLabel', FloatLabel);
app.component('TestcaseList', TestcaseList);
app.component('Testcase', Testcase);
app.component('RuleList', RuleList);
app.component('Rule', Rule);
app.component('EditorAdmin', EditorAdmin);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('Dropdown', Dropdown);
app.component('Listbox', Listbox);
app.component('Splitter', Splitter);
app.component('SplitterPanel', SplitterPanel);
app.component('ScrollPanel', ScrollPanel);
app.component('RadioButton', RadioButton);
app.component('Checkbox', Checkbox);
app.component('InputSwitch', InputSwitch);
app.component('Toolbar', Toolbar);
app.component('Fieldset', Fieldset);
app.component('Card', Card);
app.component('Editor', Editor);
app.component('Accordion', Accordion);
app.component('AccordionTab', AccordionTab);
app.component('Chart', Chart);
app.component('Steps', Steps);
app.component('Rating', Rating);
app.component('Tag', Tag);
app.component('Slider', Slider);
app.component('Menu', Menu);
app.component('SelectButton', SelectButton);

app.mount('#app');
