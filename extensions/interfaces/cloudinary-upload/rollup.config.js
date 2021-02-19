import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import vue from 'rollup-plugin-vue';
import json from '@rollup/plugin-json'
import css from "rollup-plugin-import-css";
import replace from 'rollup-plugin-replace'
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import dotenv from 'dotenv'
dotenv.config()

export default {
	input: 'src/index.js',
	output: {
		format: 'es',
		file: './index.js',
	},
	plugins: [
		commonjs(),
		resolve(),
		vue(),
		terser(),
		json(),
		css(),
		replace({  /* https://github.com/rollup/rollup/issues/805 */
			'process.env.NODE_ENV': JSON.stringify('development'),
			'process.env.VUE_ENV': JSON.stringify('browser'),

	  	}),
		injectProcessEnv({
			CDN_API_URL: process.env.CDN_API_URL,
			CDN_API_KEY: process.env.CDN_API_KEY,
			CDN_API_SECRET: process.env.CDN_API_SECRET
		})
	],
};