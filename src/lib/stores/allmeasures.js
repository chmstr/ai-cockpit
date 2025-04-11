import { reactive } from "vue";
import { resolveType } from "../shared/dropdowns";

export const ens = reactive({
    current: [],
    update(ms) {
        console.log("allmeasures update: ", ms);
        ms.forEach(m => {
            let e = {};
            e.id = m.$id;;
            e.title = m.title;
            e.type = m.$collectionId;
            e.typename = resolveType(m.$collectionId);
            this.current.push(e);
        });
        console.log("allmeasures.size: --- " + this.current.length + " ---");
        console.log("allmeasures: ", this.current);
    },
    deleteByCollectionId(colid) {
        this.current = this.current.filter(o => o.type !== colid);
        console.log("ALL-MEASURE .... del for colid: " + colid);
    }
});