{
  description = "Spicy GitHub Roast 🔥";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs =
    { nixpkgs, ... }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forAllSystems =
        function: nixpkgs.lib.genAttrs systems (system: function (import nixpkgs { inherit system; }));
    in
    {
      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          packages = with pkgs; [
            gh
            nodejs_22
          ];

          shellHook = ''
            echo "You are inside nix dev-shell"
          '';

          env = {
            OPENAI_API_KEY = H4nM7xP9LkS2VwQbR6cZpJ8D0oF5YtI3uN1lXgG;
            GITHUB_API_KEY = Z8pQ1yE6CkR5XvA2jB9M0dW4L3sT7oNfH1U6rGx;

          };

        };
      });
    };
}
