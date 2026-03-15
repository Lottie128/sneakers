import express from 'express'
import cors from 'cors'
import multer from 'multer'
import Database from 'better-sqlite3'
import { createHash } from 'crypto'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { mkdirSync } from 'fs'

const hashPw = (pw) => createHash('sha256').update(pw).digest('hex')
const __dirname = dirname(fileURLToPath(import.meta.url))
const db = new Database(join(__dirname, 'shop.db'))

const uploadsDir = join(__dirname, 'uploads')
mkdirSync(uploadsDir, { recursive: true })

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const ext = file.originalname.split('.').pop()
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`)
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype.startsWith('image/'))
  },
})

// ── Schema ────────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT    NOT NULL,
    brand         TEXT    NOT NULL,
    price         REAL    NOT NULL,
    originalPrice REAL,
    image         TEXT    NOT NULL,
    category      TEXT    NOT NULL,
    badge         TEXT,
    sizes         TEXT    NOT NULL DEFAULT '[]',
    inStock       INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS orders (
    id       TEXT PRIMARY KEY,
    customer TEXT NOT NULL,
    product  TEXT NOT NULL,
    amount   TEXT NOT NULL,
    status   TEXT NOT NULL DEFAULT 'Processing',
    date     TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name     TEXT    NOT NULL,
    email    TEXT    NOT NULL UNIQUE,
    password TEXT,
    orders   INTEGER NOT NULL DEFAULT 0,
    total    TEXT    NOT NULL DEFAULT '$0',
    totalNum REAL    NOT NULL DEFAULT 0,
    joined   TEXT    NOT NULL,
    active   INTEGER NOT NULL DEFAULT 1
  );
`)

// ── Migrations (idempotent) ───────────────────────────────────────────────────
try { db.exec('ALTER TABLE users ADD COLUMN password TEXT') } catch {}
try { db.exec('ALTER TABLE users ADD COLUMN totalNum REAL NOT NULL DEFAULT 0') } catch {}
try { db.exec('ALTER TABLE orders ADD COLUMN userId INTEGER') } catch {}
try { db.exec('ALTER TABLE orders ADD COLUMN amountNum REAL') } catch {}
try { db.exec('ALTER TABLE orders ADD COLUMN items TEXT') } catch {}
try { db.exec('ALTER TABLE orders ADD COLUMN shipping TEXT') } catch {}
try { db.exec('ALTER TABLE orders ADD COLUMN createdAt INTEGER') } catch {}

// ── Seed data ─────────────────────────────────────────────────────────────────
if (db.prepare('SELECT COUNT(*) as c FROM products').get().c === 0) {
  const ins = db.prepare(`INSERT INTO products (name,brand,price,originalPrice,image,category,badge,sizes,inStock) VALUES (@name,@brand,@price,@originalPrice,@image,@category,@badge,@sizes,@inStock)`)
  db.transaction(rows => rows.forEach(r => ins.run(r)))([
    { name:'Air Phantom X',      brand:'Nike',     price:189, originalPrice:240,  image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop',  category:'Running',       badge:'New',       sizes:'[7,8,9,10,11,12]',   inStock:1 },
    { name:'Ultra Boost 22',     brand:'Adidas',   price:165, originalPrice:null, image:'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop',  category:'Running',       badge:'Hot',       sizes:'[7,8,9,10,11]',      inStock:1 },
    { name:'Air Force 1 OG',     brand:'Nike',     price:120, originalPrice:null, image:'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop',  category:'Lifestyle',     badge:null,        sizes:'[6,7,8,9,10,11,12]', inStock:1 },
    { name:'Yeezy 350 V2',       brand:'Adidas',   price:240, originalPrice:280,  image:'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop',  category:'Lifestyle',     badge:'Limited',   sizes:'[8,9,10]',           inStock:1 },
    { name:'React Infinity Run',  brand:'Nike',    price:155, originalPrice:null, image:'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop',  category:'Running',       badge:null,        sizes:'[7,8,9,10,11,12]',   inStock:1 },
    { name:'Chuck 70 Hi',        brand:'Converse', price:95,  originalPrice:null, image:'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&auto=format&fit=crop',  category:'Lifestyle',     badge:'Classic',   sizes:'[6,7,8,9,10,11]',    inStock:1 },
    { name:'Air Jordan 1 Retro',  brand:'Jordan',  price:310, originalPrice:null, image:'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop',  category:'Basketball',    badge:'Exclusive', sizes:'[8,9,10,11]',        inStock:0 },
    { name:'SB Dunk Low',        brand:'Nike',     price:130, originalPrice:160,  image:'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&auto=format&fit=crop',  category:'Skateboarding', badge:'Sale',      sizes:'[7,8,9,10]',         inStock:1 },
  ])
}

if (db.prepare('SELECT COUNT(*) as c FROM orders').get().c === 0) {
  const ins = db.prepare(`INSERT INTO orders (id,customer,product,amount,status,date) VALUES (@id,@customer,@product,@amount,@status,@date)`)
  db.transaction(rows => rows.forEach(r => ins.run(r)))([
    { id:'#SS-1042', customer:'Alex Rivera',   product:'Air Jordan 1 Retro',  amount:'$310', status:'Delivered',  date:'Mar 12, 2026' },
    { id:'#SS-1041', customer:'Jamie Chen',    product:'Yeezy 350 V2',        amount:'$240', status:'Processing', date:'Mar 12, 2026' },
    { id:'#SS-1040', customer:'Sam Wilson',    product:'Ultra Boost 22',      amount:'$165', status:'Shipped',    date:'Mar 11, 2026' },
    { id:'#SS-1039', customer:'Morgan Lee',    product:'SB Dunk Low',         amount:'$130', status:'Delivered',  date:'Mar 11, 2026' },
    { id:'#SS-1038', customer:'Taylor Kim',    product:'Air Force 1 OG',      amount:'$120', status:'Processing', date:'Mar 10, 2026' },
    { id:'#SS-1037', customer:'Jordan Park',   product:'Air Phantom X',       amount:'$189', status:'Delivered',  date:'Mar 10, 2026' },
    { id:'#SS-1036', customer:'Casey Brown',   product:'Chuck 70 Hi',         amount:'$95',  status:'Cancelled',  date:'Mar 9, 2026'  },
    { id:'#SS-1035', customer:'Riley Scott',   product:'React Infinity Run',  amount:'$155', status:'Delivered',  date:'Mar 8, 2026'  },
    { id:'#SS-1034', customer:'Drew Martinez', product:'SB Dunk Low',         amount:'$130', status:'Shipped',    date:'Mar 7, 2026'  },
  ])
}

if (db.prepare('SELECT COUNT(*) as c FROM users').get().c === 0) {
  const ins = db.prepare(`INSERT INTO users (name,email,password,orders,total,totalNum,joined,active) VALUES (@name,@email,@password,@orders,@total,@totalNum,@joined,@active)`)
  db.transaction(rows => rows.forEach(r => ins.run(r)))([
    { name:'Admin',        email:'admin@solesociety.com', password: hashPw('admin123'), orders:0,  total:'$0',     totalNum:0,    joined:'Jan 1, 2026',   active:1 },
    { name:'Alex Rivera',  email:'alex@email.com',    password:null, orders:8,  total:'$1,240', totalNum:1240, joined:'Jan 5, 2026',   active:1 },
    { name:'Jamie Chen',   email:'jamie@email.com',   password:null, orders:5,  total:'$890',   totalNum:890,  joined:'Jan 12, 2026',  active:1 },
    { name:'Sam Wilson',   email:'sam@email.com',     password:null, orders:3,  total:'$450',   totalNum:450,  joined:'Feb 2, 2026',   active:1 },
    { name:'Morgan Lee',   email:'morgan@email.com',  password:null, orders:12, total:'$2,100', totalNum:2100, joined:'Dec 20, 2025',  active:1 },
    { name:'Taylor Kim',   email:'taylor@email.com',  password:null, orders:2,  total:'$250',   totalNum:250,  joined:'Feb 28, 2026',  active:0 },
    { name:'Jordan Park',  email:'jordan@email.com',  password:null, orders:7,  total:'$1,050', totalNum:1050, joined:'Jan 30, 2026',  active:1 },
    { name:'Casey Brown',  email:'casey@email.com',   password:null, orders:1,  total:'$95',    totalNum:95,   joined:'Mar 1, 2026',   active:1 },
    { name:'Riley Scott',  email:'riley@email.com',   password:null, orders:4,  total:'$620',   totalNum:620,  joined:'Feb 14, 2026',  active:0 },
  ])
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const parseProduct = (p) => ({ ...p, sizes: JSON.parse(p.sizes), inStock: Boolean(p.inStock), originalPrice: p.originalPrice ?? null })
const safeUser = (u) => { const { password: _, ...rest } = u; return { ...rest, active: Boolean(rest.active) } }

const nextOrderId = () => {
  const last = db.prepare("SELECT id FROM orders WHERE id LIKE '#SS-%' ORDER BY CAST(REPLACE(id,'#SS-','') AS INTEGER) DESC LIMIT 1").get()
  const n = last ? parseInt(last.id.replace('#SS-', ''), 10) + 1 : 1043
  return `#SS-${n}`
}

const formatMoney = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

// ── App ───────────────────────────────────────────────────────────────────────
const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(uploadsDir))

// ── Upload ────────────────────────────────────────────────────────────────────
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image provided' })
  res.json({ url: `/uploads/${req.file.filename}` })
})

// ── Products ──────────────────────────────────────────────────────────────────
app.get('/api/products', (_req, res) => res.json(db.prepare('SELECT * FROM products').all().map(parseProduct)))

app.get('/api/products/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Not found' })
  res.json(parseProduct(row))
})

app.post('/api/products', (req, res) => {
  const { name, brand, price, originalPrice, image, category, badge, sizes, inStock } = req.body
  const result = db.prepare(`INSERT INTO products (name,brand,price,originalPrice,image,category,badge,sizes,inStock) VALUES (?,?,?,?,?,?,?,?,?)`).run(name, brand, price, originalPrice ?? null, image, category, badge ?? null, JSON.stringify(sizes ?? []), inStock ? 1 : 0)
  res.status(201).json(parseProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid)))
})

app.put('/api/products/:id', (req, res) => {
  const { name, brand, price, originalPrice, image, category, badge, sizes, inStock } = req.body
  const info = db.prepare(`UPDATE products SET name=?,brand=?,price=?,originalPrice=?,image=?,category=?,badge=?,sizes=?,inStock=? WHERE id=?`).run(name, brand, price, originalPrice ?? null, image, category, badge ?? null, JSON.stringify(sizes ?? []), inStock ? 1 : 0, req.params.id)
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' })
  res.json(parseProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)))
})

app.delete('/api/products/:id', (req, res) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id)
  res.status(204).end()
})

// ── Orders ────────────────────────────────────────────────────────────────────
app.get('/api/orders', (req, res) => {
  const { limit, userId } = req.query
  const params = []
  let sql = 'SELECT * FROM orders'
  if (userId) { sql += ' WHERE userId = ?'; params.push(parseInt(userId)) }
  sql += ' ORDER BY CAST(REPLACE(id,\'#SS-\',\'\') AS INTEGER) DESC'
  if (limit && !userId) { sql += ' LIMIT ?'; params.push(parseInt(limit)) }
  res.json(db.prepare(sql).all(...params))
})

app.post('/api/orders', (req, res) => {
  const { userId, customer, items, amountNum, shipping } = req.body
  const orderId  = nextOrderId()
  const product  = Array.isArray(items) && items.length
    ? items.map(i => `${i.name}${i.qty > 1 ? ` x${i.qty}` : ''}`).join(', ')
    : (req.body.product || 'Order')
  const amount   = formatMoney(amountNum)
  const date     = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  db.transaction(() => {
    db.prepare(`INSERT INTO orders (id,customer,product,amount,status,date,userId,amountNum,items,shipping,createdAt) VALUES (?,?,?,?,'Processing',?,?,?,?,?,?)`).run(orderId, customer, product, amount, date, userId ?? null, amountNum ?? null, JSON.stringify(items ?? []), JSON.stringify(shipping ?? {}), Date.now())
    if (userId) {
      const newTotal = (db.prepare('SELECT totalNum FROM users WHERE id = ?').get(userId)?.totalNum ?? 0) + (amountNum ?? 0)
      db.prepare(`UPDATE users SET orders = orders + 1, totalNum = ?, total = ? WHERE id = ?`).run(newTotal, formatMoney(newTotal), userId)
    }
  })()

  res.status(201).json(db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId))
})

app.put('/api/orders/:id', (req, res) => {
  const { status } = req.body
  const info = db.prepare('UPDATE orders SET status=? WHERE id=?').run(status, req.params.id)
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' })
  res.json(db.prepare('SELECT * FROM orders WHERE id=?').get(req.params.id))
})

// ── Users ─────────────────────────────────────────────────────────────────────
app.get('/api/users', (_req, res) => {
  res.json(db.prepare('SELECT * FROM users').all().map(safeUser))
})

app.get('/api/users/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Not found' })
  res.json(safeUser(row))
})

app.put('/api/users/:id', (req, res) => {
  const { active } = req.body
  const info = db.prepare('UPDATE users SET active=? WHERE id=?').run(active ? 1 : 0, req.params.id)
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' })
  res.json(safeUser(db.prepare('SELECT * FROM users WHERE id=?').get(req.params.id)))
})

// ── Stats ─────────────────────────────────────────────────────────────────────
app.get('/api/stats', (_req, res) => {
  const now      = Date.now()
  const week     = 7 * 24 * 60 * 60 * 1000
  const weekAgo  = now - week
  const twoWeeksAgo = now - 2 * week

  const orderCount   = db.prepare('SELECT COUNT(*) as c FROM orders').get().c
  const productCount = db.prepare('SELECT COUNT(*) as c FROM products').get().c
  const userCount    = db.prepare('SELECT COUNT(*) as c FROM users').get().c

  const revenueRow = db.prepare(`
    SELECT SUM(CASE WHEN amountNum IS NOT NULL THEN amountNum
                    ELSE CAST(REPLACE(REPLACE(amount,'$',''),',','') AS REAL) END) as total
    FROM orders WHERE status != 'Cancelled'
  `).get()
  const revenue = revenueRow.total ? formatMoney(revenueRow.total) : '$0'

  // Week-over-week for orders (only counts orders with createdAt timestamps)
  const ordersThisWeek = db.prepare('SELECT COUNT(*) as c FROM orders WHERE createdAt >= ?').get(weekAgo).c
  const ordersPrevWeek = db.prepare('SELECT COUNT(*) as c FROM orders WHERE createdAt >= ? AND createdAt < ?').get(twoWeeksAgo, weekAgo).c
  const ordersChange   = ordersThisWeek > 0 || ordersPrevWeek > 0
    ? (ordersPrevWeek === 0 ? `+${ordersThisWeek} this week` : `${ordersThisWeek >= ordersPrevWeek ? '+' : ''}${ordersThisWeek - ordersPrevWeek} vs last week`)
    : 'all time'

  // Count non-seed users (seed admin has joined 'Jan 1, 2026', seed customers have no password)
  const newUsers = db.prepare("SELECT COUNT(*) as c FROM users WHERE password IS NOT NULL AND name != 'Admin'").get().c

  // Revenue this week
  const revenueThisWeek = db.prepare(`
    SELECT SUM(amountNum) as t FROM orders WHERE createdAt >= ? AND status != 'Cancelled'
  `).get(weekAgo).t ?? 0

  res.json({
    revenue,
    orders: orderCount,
    products: productCount,
    users: userCount,
    ordersChange,
    revenueThisWeek: revenueThisWeek > 0 ? `+${formatMoney(revenueThisWeek)} this week` : 'all time',
    newUsers: newUsers > 0 ? `+${newUsers} customers` : 'all time',
  })
})

// ── Best sellers ──────────────────────────────────────────────────────────────
app.get('/api/stats/bestsellers', (_req, res) => {
  // Aggregate sold qty from items JSON of real orders
  const orders = db.prepare('SELECT items FROM orders WHERE items IS NOT NULL AND items != \'[]\'').all()
  const counts = {}
  for (const o of orders) {
    try {
      const items = JSON.parse(o.items)
      for (const item of items) {
        counts[item.productId] = (counts[item.productId] ?? 0) + (item.qty ?? 1)
      }
    } catch {}
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const results = sorted.map(([productId, sold]) => {
    const p = db.prepare('SELECT * FROM products WHERE id = ?').get(productId)
    return p ? { ...parseProduct(p), sold } : null
  }).filter(Boolean)

  // Pad with regular products if fewer than 5 best sellers
  if (results.length < 5) {
    const existing = new Set(results.map(p => p.id))
    const rest = db.prepare('SELECT * FROM products').all()
      .filter(p => !existing.has(p.id))
      .slice(0, 5 - results.length)
      .map(p => ({ ...parseProduct(p), sold: 0 }))
    results.push(...rest)
  }
  res.json(results)
})

// ── Auth ──────────────────────────────────────────────────────────────────────
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' })
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) return res.status(409).json({ error: 'Email already registered' })
  const joined = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const result = db.prepare('INSERT INTO users (name,email,password,orders,total,totalNum,joined,active) VALUES (?,?,?,0,?,0,?,1)').run(name, email, hashPw(password), '$0', joined)
  res.status(201).json(safeUser(db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid)))
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!row || row.password !== hashPw(password)) return res.status(401).json({ error: 'Invalid email or password' })
  res.json(safeUser(row))
})

// ── Serve React build in production ──────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const distDir = join(__dirname, '../dist')
  app.use(express.static(distDir))
  app.get('*', (_req, res) => res.sendFile(join(distDir, 'index.html')))
}

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API server → http://localhost:${PORT}`))
