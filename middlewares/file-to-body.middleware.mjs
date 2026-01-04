export const filesToBody = (req, res, next) => {
   
  if (req.files && req.files.length) {
    req.files.forEach((file) => {
      const fieldName = file.fieldname;
      const fileUrl = file.path; 
      if (req.body[fieldName]) {
        if (Array.isArray(req.body[fieldName])) {
          req.body[fieldName].push(fileUrl);
        } else {
          req.body[fieldName] = [req.body[fieldName], fileUrl];
        }
      } else {
        req.body[fieldName] = fileUrl;
      }
    });
  }
  next();
};
