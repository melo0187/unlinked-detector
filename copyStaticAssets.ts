import * as shell from "shelljs";

shell.cp("-R", "src/client/css", "dist/client/css/");
shell.cp("src/client/index.html", "dist/client/index.html");
