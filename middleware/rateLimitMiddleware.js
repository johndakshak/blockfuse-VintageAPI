import { rateLimit, MINUTE } from 'express-rate-limit'

const generalLimiter = rateLimit({
	windowMs: 15 * MINUTE, 
	limit: 100, 
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	ipv6Subnet: 56, 
});

const loginLimiter = rateLimit({
	windowMs: 15 * MINUTE, 
	limit: 5, 
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	ipv6Subnet: 56, 
});

export { generalLimiter, loginLimiter };