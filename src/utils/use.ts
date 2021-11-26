export const useImportDialog = () => {
  return {
    type: 'FormPage',
    state: {
      form: {
        items: {
          file: {
            type: 'Upload',
            prop: 'file',
            label: '点击上传文件',
            state: {
              value: '',
              file: null,
              type: 'xlsx'
            }
          }
        }
      },
      buttons: [
        {
          label: '确认',
          action: 'import',
          type: 'primary'
        }
      ]
    }
  }
}

export const usePasswordDialog = () => {
  return {
    type: 'Password',
    state: {
      action: ''
    }
  }
}

