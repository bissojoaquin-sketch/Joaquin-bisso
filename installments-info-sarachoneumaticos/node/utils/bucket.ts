export const getBucketName = (production: boolean) => {
  return `onepaydiscount${!production ? 'qa' : ''}`
}
