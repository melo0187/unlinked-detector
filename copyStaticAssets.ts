import * as shell from "shelljs";

shell.rm("-R", "dist/public");
shell.mkdir("dist/public");
shell.cp("-R", "src/public/js", "dist/public/js/");
shell.cp("-R", "src/public/css", "dist/public/css/");
shell.cp("src/public/index.html", "dist/public/index.html");