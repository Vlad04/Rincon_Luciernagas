# El rincón de las luciérnagas

Sitio web estático para clases de regularización, listo para publicarse gratis con GitHub Pages.

## Estructura

```text
docs/
├── index.html
└── assets/
    ├── css/style.css
    ├── images/hero-luciernagas.png
    └── js/main.js
```

## Antes de publicar

1. Abre `docs/index.html` para cambiar textos, materias y testimonios.
2. Sustituye `5210000000000` por tu WhatsApp con código de país, sin `+`, espacios ni guiones.
3. Sustituye el correo y el enlace de Instagram.
4. Abre `docs/index.html` en tu navegador para revisar el resultado.

## Publicar con GitHub Pages

1. Crea un repositorio vacío en GitHub llamado `el-rincon-de-las-luciernagas`.
2. Desde la terminal, dentro de esta carpeta, ejecuta:

```bash
git init
git add .
git commit -m "Primera versión del sitio"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/el-rincon-de-las-luciernagas.git
git push -u origin main
```

3. En GitHub abre `Settings` → `Pages`.
4. En `Build and deployment`, selecciona `Deploy from a branch`.
5. Elige la rama `main`, la carpeta `/docs` y presiona `Save`.
6. GitHub mostrará la dirección pública cuando termine la publicación.
