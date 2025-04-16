import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Antimatter custom colors
				antimatter: {
					blue: '#1a2b47',      // Matter Blue
					red: '#722f37',       // Antimatter Red
					yellow: '#f9d423',    // Energy Yellow
					gray: '#2d3436',      // Neutral Gray
					bg: '#080c14',        // Background
					text: '#ffffff',      // Text
					textDim: '#e0e0e0'    // Secondary Text
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'pulse-glow': {
					'0%, 100%': { 
						opacity: '1',
						boxShadow: '0 0 5px rgba(249, 212, 35, 0.5), 0 0 10px rgba(249, 212, 35, 0.3)' 
					},
					'50%': { 
						opacity: '0.8',
						boxShadow: '0 0 15px rgba(249, 212, 35, 0.8), 0 0 20px rgba(249, 212, 35, 0.5)' 
					}
				},
				'particle-drift': {
					'0%, 100%': {
						transform: 'translateY(0px) translateX(0px)',
						opacity: '0.3',
					},
					'50%': {
						transform: 'translateY(30px) translateX(20px)',
						opacity: '0.8',
					},
				},
				'pulse-slow': {
					'0%, 100%': {
						opacity: '0.4',
						transform: 'scale(1)',
					},
					'50%': {
						opacity: '0.8',
						transform: 'scale(1.2)',
					},
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'split-appear-left': {
					'0%': { opacity: '0', transform: 'translateX(-50px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'split-appear-right': {
					'0%': { opacity: '0', transform: 'translateX(50px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'flash': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
				'particle-drift': 'particle-drift 10s ease-in-out infinite',
				'pulse-slow': 'pulse-slow 6s ease-in-out infinite',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'split-appear-left': 'split-appear-left 0.7s ease-out',
				'split-appear-right': 'split-appear-right 0.7s ease-out',
				'flash': 'flash 1.5s ease-in-out'
			},
			fontFamily: {
				exo: ['Exo 2', 'sans-serif'],
				inter: ['Inter', 'sans-serif'],
				space: ['Space Mono', 'monospace']
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
