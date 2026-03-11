import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zhjepwmexxkqajqjbeax.supabase.co'
const supabaseKey = 'sb_publishable_ZTm0gb3Myx2KD5IAZzUqOg_q_77cnAk'

export const supabase = createClient(supabaseUrl, supabaseKey)
