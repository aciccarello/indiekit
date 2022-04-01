import test from "ava";
import { Indiekit } from "@indiekit/indiekit";
import { LocalStore } from "../../index.js";

const ftp = new LocalStore({
  directory: "dirName",
});

test("Gets plug-in info", (t) => {
  t.is(ftp.name, "Local store");
  t.is(ftp.info.name, "dirName directory on local machine");
  t.is(ftp.info.uid, "file://dirName");
});

test("Initiates plug-in", (t) => {
  const indiekit = new Indiekit();
  ftp.init(indiekit);

  t.is(indiekit.publication.store.info.name, "dirName directory on local machine");
});
