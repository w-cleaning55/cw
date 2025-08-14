/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: 'https://cw.com.sa',
	generateRobotsTxt: true,
	robotsTxtOptions: {
		policies: [
			{ userAgent: '*', allow: '/' },
			{ userAgent: '*', disallow: ['/api'] },
		],
	},
	exclude: ['/api/*'],
	changefreq: 'weekly',
	priority: 0.7,
	autoLastmod: true,
	sitemapSize: 7000,
	outDir: 'public',
	transform: async (config, path) => ({
		loc: path,
		changefreq: 'weekly',
		priority: path === '/' ? 1.0 : 0.7,
		lastmod: new Date().toISOString(),
	}),
};