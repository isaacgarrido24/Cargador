# 🚀 GUÍA RÁPIDA - EMPEZAR EN 5 MINUTOS

## ⚡ Paso 1: Abrir la Página (30 segundos)

1. **Haz doble clic en `index.html`** (la página se abrirá en tu navegador)
2. ¡Listo! Tu tienda está funcionando

## 🎨 Paso 2: Personalización Básica (2 minutos)

### Cambiar nombre de la tienda
Abre `index.html` con un editor de texto (Notepad, VS Code, etc.)

Busca:
```html
<span>CargaPro</span>
```

Reemplaza con tu nombre:
```html
<span>Mi Tienda</span>
```

### Cambiar el título de la página
Busca:
```html
<title>CargaPro - Cargador Premium Ultra Rápido</title>
```

Cambia a:
```html
<title>Mi Tienda - Mi Producto</title>
```

### Cambiar el nombre del producto
Busca:
```html
<h3>CargaPro Ultra 100W</h3>
```

Cambia a:
```html
<h3>Mi Cargador Especial</h3>
```

### Cambiar el precio
Busca:
```html
<span class="precio-actual">$49.99</span>
<span class="precio-original">$79.99</span>
```

Cambia a tus precios (ej: $30 y $50)

## 🧪 Paso 3: Probar la Funcionalidad (2 minutos)

### Agregar producto al carrito
1. Baja a la sección "Especificaciones del Producto"
2. Usa los botones + - para cambiar la cantidad
3. Haz clic en "Agregar al Carrito"
4. Verás una notificación verde con el mensaje

### Ver el carrito
1. Observa el número en el carrito (🛒) del navbar
2. Haz clic en el carrito para ver el modal
3. Verás los productos agregados

### Ir al checkout
1. En el modal del carrito, haz clic en "Proceder al Pago"
2. Completa el formulario con datos de prueba
3. Haz clic en "Completar Pago"
4. Verás un mensaje de éxito (simulado)

### Escribir una reseña
1. Baja a la sección "Reseñas"
2. Haz clic en "Escribir Reseña"
3. Completa todos los campos
4. Haz clic en las estrellas para calificar
5. Haz clic en "Enviar Reseña"

## 🎨 Paso 4: Cambiar Colores (1 minuto)

Abre `css/styles.css` y busca:

```css
:root {
    --primary-color: #3b82f6;      /* Azul */
    --primary-dark: #1e40af;       /* Azul oscuro */
    --success-color: #10b981;      /* Verde */
    --warning-color: #f59e0b;      /* Ámbar */
    --danger-color: #ef4444;       /* Rojo */
}
```

Cambia los códigos de color:
- [Ver colores aquí](https://color-hex.com)
- Copia un código hex (ej: #ff6b6b)
- Reemplaza en el archivo

Ejemplo:
```css
:root {
    --primary-color: #ff6b6b;      /* Rojo vivo */
    --primary-dark: #ee5a52;       /* Rojo oscuro */
}
```

## 📝 Paso 5: Actualizar información de contacto (1 minuto)

### Email
Busca en `index.html`:
```html
<li>📧 info@cargapro.com</li>
```

Cambia a tu email:
```html
<li>📧 tuemil@tudominio.com</li>
```

### Teléfono
Busca:
```html
<li>📞 +1 (555) 123-4567</li>
```

Cambia a tu teléfono:
```html
<li>📞 +34 (555) 567-8901</li>
```

### Dirección
Busca:
```html
<li>📍 123 Tech Street, San Francisco</li>
```

Cambia a tu dirección:
```html
<li>📍 Calle Principal 123, Tu Ciudad</li>
```

---

## 📱 Probando en Móvil

1. **En el navegador**: Presiona `F12` (abre herramientas de desarrollo)
2. **Haz clic en el icono de dispositivo** (arriba a la izquierda)
3. **Selecciona un dispositivo móvil** (ej: iPhone 13)
4. Verás cómo se ve en móvil

---

## 🐛 Si Algo No Funciona

### El carrito no funciona
- Presiona `F12` para ver la consola
- Verifica que no hay errores en rojo
- Asegúrate de que JavaScript está habilitado

### Los estilos no se ven
- Presiona `Ctrl + F5` para refrescar sin caché
- Verifica que el archivo `css/styles.css` existe
- Comprueba que la ruta sea correcta

### Las imágenes no cargan
- Las imágenes son SVG (ilustraciones), funciona así
- Para agregar fotos reales, copia la URL y reemplaza en `index.html`

---

## 🎯 Cambios Más Comunes

### Cambiar descripción del producto
En `index.html`, busca:
```html
<p>La tecnología de carga más rápida del mercado. Carga completa en menos de 30 minutos.</p>
```

### Agregar una característica
Busca:
```html
<li>⚡ Carga ultra rápida de 100W</li>
```

Agrega líneas nuevas:
```html
<li>⚡ Carga ultra rápida de 100W</li>
<li>🎵 Cero ruido durante la carga</li>
<li>♻️ Fabricado con materiales reciclados</li>
```

### Cambiar cantidad de reseñas
Simplemente copia y pega el bloque `<div class="resena-card">` debajo:
```html
<div class="resena-card">
    <!-- Copia el contenido de una reseña existente -->
</div>
```

---

## 🌐 Próximo Paso: Subir a Internet

Una vez personalizado, puedes subir tu tienda GRATIS a:

### **Opción 1: Netlify (Recomendado - MÁS FÁCIL)**
1. Ve a [netlify.com](https://netlify.com)
2. Haz clic en "Sign Up"
3. Crea una cuenta con GitHub
4. Crea un repositorio en GitHub con tus archivos
5. Conecta el repositorio a Netlify
6. ¡Listo! Tu sitio estará en vivo

### **Opción 2: Vercel**
Similar a Netlify, también es GRATIS

### **Opción 3: GitHub Pages**
1. Crea un repositorio en GitHub
2. Sube tus archivos
3. Ve a Settings > Pages
4. Selecciona "main branch"
5. ¡Listo!

---

## 💡 TIPS

✨ **Navega suavemente**: Los enlaces de navegación tienen scroll suave automático

🛒 **El carrito persiste**: Si recargas la página, el carrito sigue ahí (se guarda local)

⭐ **Las reseñas son reales**: Cuando escribes una reseña, aparece arriba de la lista

💳 **Pago simulado**: Por ahora es demo. Puedes probar sin datos reales

📱 **Es responsive**: Cambia el tamaño de la ventana, verás que se adapta

---

## 📂 Estructura de Archivos

```
Cargador/
├── index.html          ← Tu página principal
├── css/
│   └── styles.css      ← Los estilos y colores
├── js/
│   └── main.js         ← La lógica y funcionalidad
├── README.md           ← Documentación completa
└── ... otros archivos
```

---

## 🎉 ¡Listo!

Tu tienda profesional está lista. Ahora puedes:

1. ✅ **Personalizar** con tu contenido
2. ✅ **Probar** toda la funcionalidad
3. ✅ **Mostrar** a amigos y familia
4. ✅ **Compartir** en redes sociales
5. ✅ **Subir** a internet

---

**¿Preguntas?**
- Lee `README.md` para guía completa
- Lee `INTEGRACIONES.md` para conectar pagos reales
- Lee `CHECKLIST_PRODUCCION.md` antes de vender

¡Mucho éxito! 🚀
