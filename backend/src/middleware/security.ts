import { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Rate limiting to prevent brute force attacks
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for authentication routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// SQL injection prevention middleware
export const preventSqlInjection = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Check all query parameters
  for (const key in req.query) {
    if (typeof req.query[key] === "string") {
      const value = req.query[key] as string;
      // Check for common SQL injection patterns
      const sqlPatterns = [
        /(\bselect\b.*\bfrom\b)/i,
        /(\binsert\b.*\binto\b)/i,
        /(\bupdate\b.*\bset\b)/i,
        /(\bdelete\b.*\bfrom\b)/i,
        /(\bdrop\b.*\btable\b)/i,
        /(\balter\b.*\btable\b)/i,
        /(\bunion\b.*\bselect\b)/i,
        /(\bexec\b|\bexecute\b)/i,
        /(['";])/,
      ];

      for (const pattern of sqlPatterns) {
        if (pattern.test(value)) {
          return res.status(400).json({
            message: "Invalid characters in request",
          });
        }
      }
    }
  }

  // Check request body
  if (req.body && typeof req.body === "object") {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        const value = req.body[key] as string;
        const sqlPatterns = [
          /(\bselect\b.*\bfrom\b)/i,
          /(\binsert\b.*\binto\b)/i,
          /(\bupdate\b.*\bset\b)/i,
          /(\bdelete\b.*\bfrom\b)/i,
          /(\bdrop\b.*\btable\b)/i,
          /(\balter\b.*\btable\b)/i,
          /(\bunion\b.*\bselect\b)/i,
          /(\bexec\b|\bexecute\b)/i,
          /(['";])/,
        ];

        for (const pattern of sqlPatterns) {
          if (pattern.test(value)) {
            return res.status(400).json({
              message: "Invalid characters in request",
            });
          }
        }
      }
    }
  }

  next();
};

// XSS prevention middleware
export const preventXSS = (req: Request, res: Response, next: NextFunction) => {
  // Check all query parameters
  for (const key in req.query) {
    if (typeof req.query[key] === "string") {
      const value = req.query[key] as string;
      // Check for XSS patterns
      const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<.*?>/g,
      ];

      for (const pattern of xssPatterns) {
        if (pattern.test(value)) {
          return res.status(400).json({
            message: "Invalid characters in request",
          });
        }
      }
    }
  }

  // Check request body
  if (req.body && typeof req.body === "object") {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        const value = req.body[key] as string;
        const xssPatterns = [
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          /javascript:/gi,
          /on\w+\s*=/gi,
          /<.*?>/g,
        ];

        for (const pattern of xssPatterns) {
          if (pattern.test(value)) {
            return res.status(400).json({
              message: "Invalid characters in request",
            });
          }
        }
      }
    }
  }

  next();
};
