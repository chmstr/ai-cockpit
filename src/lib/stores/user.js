import { ID } from "appwrite";
import { account } from "../../appwrite";
import { reactive, computed } from "vue";
import { ADMIN_USER_MAIL } from "../shared/constants";
import { ens as systems } from "./systems";

export const isSystemEditor = computed(() => {
  console.log("usercheck.systems.current ", systems.current);
  console.log("usercheck.systems.system ", systems.system);
  let isSystemEditor = false;
  let editorstr = systems.system?.editors;
  console.log("usercheck.system.editors: ", editorstr);
  try {
    let editorarray = editorstr.split(",").map(item => item.trim());
    console.log("usercheck.editors.array: ", editorarray);
    isSystemEditor = editorarray.includes(user.current.email);
    console.log("usercheck.isSystemEditor: ", isSystemEditor);
  } catch (e) {
    console.log("usercheck.error.system.editors: ", editorstr);
    console.log("usercheck.error", e);
  }
  return isSystemEditor;
})

export const isGlobalAdmin = computed(() => {
  let isAdmin = false;
  console.log("usercheck.isAdmin.current.email: ", user.current.email);
  console.log("usercheck.isAdmin.globaladmin.emails: ", ADMIN_USER_MAIL);

  //  if( user.current.email == ADMIN_USER_MAIL ) isAdmin = true;

  try {
    let adminarray = ADMIN_USER_MAIL.split(",").map(item => item.trim());
    console.log("usercheck.admin.array: ", adminarray);
    isAdmin = adminarray.includes(user.current.email);
    console.log("usercheck.isAdmin1: ", isAdmin);
  } catch (e) {
    console.error(e);
  }

  console.log("usercheck.isAdmin2: ", isAdmin);
  return isAdmin;
})

export const canEdit = computed(() => {
  let isAdmin = isGlobalAdmin;
  let isEditor = isSystemEditor;
  console.log("usercheck.canEdit.isAdmin: ", isAdmin.value);
  console.log("usercheck.canEdit.isEditor: ", isEditor.value);
  let canEditValue = isEditor.value || isAdmin.value;
  console.log("usercheck.canEdit: ", canEditValue);
  return canEditValue;
});

export const roleName = computed(() => {
  let p = "";
  if (isGlobalAdmin.value) {
    p = "(Admin)";
    console.log("usercheck.roleName.isGlobalAdmin");
  }
  else if (isSystemEditor.value) p = "(Editor)";
  else p = "(Viewer)";

  return p;
});


export const user = reactive({
  current: null,
  errormsg: "",
  async init() {
    try {
      this.current = await account.get();

    } catch (e) {
      this.current = null;
      this.errormsg = e;
      console.log( "user.init.catch", e );
    }


  },
  async register(email, password) {
    await account.create(ID.unique(), email, password);
    await this.login(email, password);
  },
  async login(email, password) {
    await account.createEmailSession(email, password);
    window.location.href = "/"; // Redirect to home page
  },
  async logout() {
    await account.deleteSession("current");
    this.current = null;
  },
});

