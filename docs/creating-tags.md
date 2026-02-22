# Como criar TAGs no GitHub

Este documento mostra formas comuns de criar tags (marcas) no Git e publicá-las no GitHub.

## Tipos de tag

- Lightweight: somente um ponteiro para um commit (simples).
- Annotated (anotada): possui metadata (autor, data, mensagem) e é recomendada para releases.

## Criar tags localmente (Git)

1. Criar uma *lightweight* tag:

```bash
git tag v1.2.3
```

2. Criar uma *annotated* tag (recomendada para releases):

```bash
git tag -a v1.2.3 -m "Release v1.2.3"
```

3. Criar uma tag assinada (GPG):

```bash
git tag -s v1.2.3 -m "Signed release v1.2.3"
```

## Enviar tags para o GitHub

- Enviar uma tag específica:

```bash
git push origin v1.2.3
```

- Enviar todas as tags locais:

```bash
git push --tags
```

## Criar tags via interface do GitHub (releases)

1. No repositório GitHub, vá para **Releases** → **Draft a new release**.
2. Insira a versão no campo *Tag version* (ex.: `v1.2.3`).
3. Preencha o título e a descrição (changelog) e clique em **Publish release**.

Isso cria a tag no repositório remoto apontando para o commit selecionado.

## Boas práticas

- Use tags anotadas para versões liberadas (releases).
- Sempre atualize o changelog ou descrição da release ao criar a tag.
- Use `git push --tags` em CI somente quando necessário, para evitar empurrar tags de desenvolvimento acidentalmente.

## Versionamento Semântico (SemVer)

Recomenda-se seguir o padrão SemVer para nomear versões/tags. O formato SemVer é `MAJOR.MINOR.PATCH`, onde:

- `MAJOR`: quando você faz mudanças incompatíveis na API.
- `MINOR`: quando adiciona funcionalidades mantendo compatibilidade retroativa.
- `PATCH`: quando faz correções de bugs compatíveis.

Exemplos:

- `1.0.0` — primeira versão estável.
- `1.2.3` — versão com novas funcionalidades e correções (MAJOR=1, MINOR=2, PATCH=3).

Ao criar releases, prefira tags anotadas com a tag SemVer correspondente e inclua no texto da release notas sobre o que mudou (breaking changes, features, fixes).

Ferramentas e dicas:

- Use `git tag -a v1.2.3 -m "Release v1.2.3"` para criar uma tag anotada com o prefixo `v` comum (ex.: `v1.2.3`).
- Mantenha um CHANGELOG.md ou use convenções como Conventional Commits para gerar changelogs automaticamente.


## Exemplos (PowerShell)

```powershell
# criar tag anotada
git tag -a v1.2.3 -m "Release v1.2.3"
# enviar tag específica
git push origin v1.2.3
```
