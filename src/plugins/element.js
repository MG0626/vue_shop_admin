import Vue from 'vue'
import { 
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Menu,
  MenuItem,
  Submenu,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem
} from 'element-ui'
import "element-ui/lib/theme-chalk/index.css";

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);

Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Avatar);
Vue.use(Dropdown);
Vue.use(DropdownItem);
Vue.use(DropdownMenu);

Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(MenuItemGroup);

Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);



Vue.prototype.$message = Message;

