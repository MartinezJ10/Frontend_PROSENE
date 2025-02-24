import { defaultConfig } from '@formkit/vue'
import { createMultiStepPlugin,createLocalStoragePlugin  } from '@formkit/addons'

import '@formkit/addons/css/multistep'

const config = defaultConfig({
    plugins: [
      createMultiStepPlugin(),
      createLocalStoragePlugin({
      // plugin defaults:
      prefix: 'formkit',
      key: undefined,
      control: undefined,
      maxAge: 3600000, // 1 hour
      debounce: 200,
      beforeSave: undefined,
      beforeLoad: undefined
    })
  ],

    
  })

export default config