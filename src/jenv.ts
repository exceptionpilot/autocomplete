const programGenerator: Fig.Generator = {
  script: `for i in $(echo $PATH | tr ":" "\\n"); do [[ -d "$i" ]] && find "$i" -maxdepth 1 -type f -perm -111 && find "$i" -maxdepth 1 -type l -perm -111; done`,
  postProcess: (out) =>
    out
      .split("\n")
      .filter((value) => value.startsWith("/"))
      .map((path) => path.split("/")[path.split("/").length - 1])
      .map((pr) => ({
        name: pr,
        description: "Executable file",
        type: "arg",
      })),
};
const generateAllShims: Fig.Generator = {
  script: "jenv shims --short",
  postProcess: function (out) {
    return out
      .split("\n")
      .filter((line) => line && line.trim() !== "")
      .map((command) => ({
        name: command,
        icon: "fig://icon?type=command",
        priority: 51,
      }));
  },
};
const generateAllCommands: Fig.Generator = {
  script: "jenv commands",
  postProcess: function (out) {
    return out
      .split("\n")
      .filter(
        (line) => line && line.trim() !== "" && line.trim() !== "--version"
      )
      .map((command) => ({
        name: command,
        icon: "fig://icon?type=command",
        priority: 51,
      }));
  },
};
const generateAllPlugins: Fig.Generator = {
  script: "jenv plugins",
  postProcess: function (out) {
    return out
      .split("\n")
      .filter((line) => line && line.trim() !== "" && line.trim())
      .map((command) => ({
        name: command,
        description: "Enable " + command + " plugin",
        icon: "fig://icon?type=command",
        priority: 51,
      }));
  },
};
const generateJEnvVersions: Fig.Generator = {
  script: "jenv versions --bare",
  postProcess: function (out) {
    return out
      .split("\n")
      .filter((line) => line && line.trim() !== "" && line.trim())
      .map((command) => ({
        name: command,
        description: "Java Version " + command,
        icon: "☕️",
        priority: 51,
      }));
  },
};

const completionSpec: Fig.Spec = {
  name: "jenv",
  description: "Manage your Java environment",
  subcommands: [
    {
      name: "commands",
      description: "List all available JEnv commands",
    },
    {
      name: "help",
      description:
        "Parses and displays help contents from a command's source file",
      options: [
        {
          name: "--usage",
        },
      ],
      args: {
        name: "COMMAND",
        generators: generateAllCommands,
      },
    },
    {
      name: "info",
      description: "Show information about which command will be executed",
      args: {
        name: "command",
        generators: generateAllShims,
      },
    },
    {
      name: "add",
      description:
        'Add JDK into jenv. A alias name will be generated by parsing "java -version"',
      args: {
        name: "JAVA_HOME",
        template: "folders",
      },
    },
    {
      name: "enable-plugin",
      description: "Activate a jEnv plugin",
      args: {
        name: "pluginName",
        description: "Plugin Name",
        generators: generateAllPlugins,
      },
    },
    {
      name: "disable-plugin",
      description: "Deactivate a jEnv plugin",
      args: {
        name: "pluginName",
        description: "Plugin Name",
        generators: generateAllPlugins,
      },
    },
    {
      name: "doctor",
      description: "Run jEnv diagnostics",
    },
    {
      name: "exec",
      description:
        "Runs an executable by first preparing PATH so that the selected Java version's `bin' directory is at the front",
      args: [
        {
          name: "command",
          generators: programGenerator,
          filterStrategy: "fuzzy",
        },
        {
          name: "args",
          isVariadic: true,
          isOptional: true,
        },
      ],
    },
    {
      name: "global",
      description: "Sets the global Java version",
      args: {
        name: "version",
        generators: generateJEnvVersions,
      },
    },
    {
      name: "global-options",
      description: "Sets the global Java options",
      args: {
        name: "options",
        isVariadic: true,
      },
    },
    {
      name: "local",
      description:
        "Sets the local application-specific Java version by writing the version name to a file named `.java-version'",
      args: {
        name: "version",
        generators: generateJEnvVersions,
      },
      options: [
        {
          name: "--unset",
          description: "Remove local jEnv settings",
        },
      ],
    },
    {
      name: "local-options",
      description: "Sets the local application-specific Java options",
      args: {
        name: "options",
        isVariadic: true,
      },
    },
    {
      name: "shell",
      description:
        "Sets a shell-specific Java version by setting the `JENV_VERSION'",
      args: {
        name: "version",
        generators: generateJEnvVersions,
      },
      options: [
        {
          name: "--unset",
          description: "Remove shell jEnv settings",
        },
      ],
    },
    {
      name: "shell-options",
      description: "Sets the shell-specific Java options",
      args: {
        name: "options",
        isVariadic: true,
      },
    },
    {
      name: "hooks",
      description: "List hook scripts for a given jenv command",
      args: {
        name: "command",
        generators: generateAllShims,
      },
    },
    {
      name: "init",
      description: "Configure the shell environment for jenv",
    },
    {
      name: "javahome",
      description: "Display path to selected JAVA_HOME",
    },
    {
      name: "macos-javahome",
      description:
        "Installs a file located at ~/Library/LaunchAgents/jenv-environment.plist . It sets JAVA_HOME for GUI applications on startup for the **currently active version of Java**",
    },
    {
      name: "options",
      description: "Show the current Java options",
    },
    {
      name: "options-file",
      description: "Detect the file that sets the current jenv jvm options",
    },
    {
      name: "options-file-read",
      description: "Read options from file",
      args: {
        name: "file",
        template: "filepaths",
      },
    },
    {
      name: "options-file-write",
      description: "Write options to a file",
      args: [
        {
          name: "file",
          template: "filepaths",
        },
        {
          name: "options",
          isVariadic: true,
        },
      ],
    },
    {
      name: "prefix",
      description: "Displays the directory where a Java version is installed",
      args: {
        name: "version",
        isOptional: true,
        generators: generateJEnvVersions,
      },
    },
    {
      name: "refresh-plugins",
      description: "Refresh plugins links",
    },
    {
      name: "refresh-versions",
      description: "Refresh alias names",
    },
    {
      name: "rehash",
      description: "Rehash jenv shims (run this after installing executables)",
    },
    {
      name: "remove",
      description: "Remove JDK installations",
      args: {
        name: "version",
        generators: generateJEnvVersions,
      },
    },
    {
      name: "root",
      description:
        "Display the root directory where versions and shims are kept",
    },
    {
      name: "shims",
      description: "List existing jenv shims",
      options: [
        {
          name: "--short",
          description: "Show only files without path",
        },
      ],
    },
    {
      name: "version",
      description:
        "Shows the currently selected Java version and how it was selected",
    },
    {
      name: "versions",
      description: "Lists all Java versions found in `$JENV_ROOT/versions/*'",
      options: [
        {
          name: "--bare",
          description: "Display only version",
        },
        {
          name: "--verbose",
          description: "Display verbose output",
        },
      ],
    },
    {
      name: "whence",
      description: "List all Java versions that contain the given executable",
      options: [
        {
          name: "--path",
        },
      ],
      args: {
        name: "command",
        generators: generateAllShims,
      },
    },
    {
      name: "which",
      description:
        "Displays the full path to the executable that jenv will invoke when you run the given command",
      args: {
        name: "command",
        generators: generateAllShims,
      },
    },
  ],
  options: [
    {
      name: ["--help", "-h"],
      description: "Show help for jEnv",
    },
    {
      name: "--version",
      description: "Show version for jEnv",
    },
  ],
};
export default completionSpec;
