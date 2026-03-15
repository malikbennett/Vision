// config/supabase.js
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY  // use service key on backend, not anon key
)

module.exports = supabase
