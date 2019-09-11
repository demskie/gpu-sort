#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_bytes;
uniform float u_width;
uniform float u_mode;
uniform float u_endianness;

const float PASSTHROUGH = 0.0;
const float INTEGER = 1.0;
const float FLOAT = 2.0;

const float LITTLE_ENDIAN = 0.0;
const float BIG_ENDIAN = 1.0;

float round(float);
float floatEquals(float, float);
float floatLessThan(float, float);
float floatGreaterThan(float, float);
float floatLessThanOrEqual(float, float);
float floatGreaterThanOrEqual(float, float);

void main() {
	// get current texel
	vec4 texel = texture2D(u_bytes, vec2(gl_FragCoord.xy) / u_width);

	// reorder if endianness if not little endian
	vec4 reordered = floatEquals(u_endianness, LITTLE_ENDIAN) * texel.rgba;
	reordered.r += floatEquals(u_endianness, BIG_ENDIAN) * texel.a;
	reordered.g += floatEquals(u_endianness, BIG_ENDIAN) * texel.b;
	reordered.b += floatEquals(u_endianness, BIG_ENDIAN) * texel.g;
	reordered.a += floatEquals(u_endianness, BIG_ENDIAN) * texel.r;

	// denormalize texel data
	texel = 255.0 * reordered;

	// initialize flipped texel
	vec4 flipped = floatEquals(u_mode, PASSTHROUGH) * texel.rgba;

	// determine if we should flip the bits or not
	float signBitIsSet = floatGreaterThanOrEqual(round(texel.a), 128.0);

	// for integers just flip the sign bit
	flipped.r += floatEquals(u_mode, INTEGER) * texel.r;
	flipped.g += floatEquals(u_mode, INTEGER) * texel.g;
	flipped.b += floatEquals(u_mode, INTEGER) * texel.b;
	flipped.a += floatEquals(u_mode, INTEGER) * floatEquals(signBitIsSet, 0.0) * (texel.a + 128.0)
			   + floatEquals(u_mode, INTEGER) * floatEquals(signBitIsSet, 1.0) * (texel.a - 128.0);

	// NOTE: to untransform floats we must invert the logic seen in `transform.frag`
	// for floats flip only sign bit if the sign bit WAS already set - otherwise flip all of the bits
	flipped.r += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * texel.r
			   + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * (255.0 - texel.r);
	flipped.g += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * texel.g
			   + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * (255.0 - texel.g);
	flipped.b += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * texel.b
			   + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * (255.0 - texel.b);
	flipped.a += floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 1.0) * (texel.a - 128.0)
			   + floatEquals(u_mode, FLOAT) * floatEquals(signBitIsSet, 0.0) * (255.0 - texel.a);

	// output denormalized bytes
	gl_FragColor = flipped.rgba / 255.0;
}