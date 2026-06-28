import type { EffectDescriptor, RGB } from './types'

function colorCtor(c: RGB): string {
  return `Color base(${c.r}, ${c.g}, ${c.b});`
}

export function toYaml(d: EffectDescriptor, name: string): string {
  if (d.type === 'twinkle') {
    return [
      '- addressable_twinkle:',
      `    name: "${name}"`,
      `    twinkle_probability: ${Math.round(d.probability * 100)}%`,
    ].join('\n')
  }
  if (d.type === 'rainbow') {
    return [
      '- addressable_rainbow:',
      `    name: "${name}"`,
      `    width: ${d.width}`,
    ].join('\n')
  }

  const header = [
    '- addressable_lambda:',
    `    name: "${name}"`,
    '    update_interval: 50ms',
    '    lambda: |-',
  ]
  const body: string[] = ['      static int frame = 0;', '      const int n = it.size();', `      ${colorCtor(d.color)}`]

  if (d.type === 'solid') {
    body.push('      for (int i = 0; i < n; i++) it[i] = base;')
    for (const ind of d.indicators) {
      body.push(`      if (n > ${ind.index}) it[${ind.index}] = Color(${ind.color.r}, ${ind.color.g}, ${ind.color.b});`)
    }
  } else if (d.type === 'rotate') {
    const dir = d.direction === 'cw' ? '' : 'n - '
    body.push(
      `      int head = ${dir}(frame % n);`,
      '      head = (head % n + n) % n;',
      '      for (int i = 0; i < n; i++) {',
      '        int behind = ((head - i) % n + n) % n;',
      `        float k = behind == 0 ? ${d.brightness.toFixed(2)}f : (behind <= ${d.tail} ? (1.0f - (float)behind / ${d.tail + 1}) * ${d.brightness.toFixed(2)}f : 0.0f);`,
      '        it[i] = base * (uint8_t)(k * 255);',
      '      }',
    )
  } else if (d.type === 'pulse') {
    body.push(
      '      float phase = (frame % 20) / 20.0f;',
      '      float tri = phase < 0.5f ? phase * 2 : (1 - phase) * 2;',
      `      float k = ${d.minBrightness.toFixed(2)}f + (1 - ${d.minBrightness.toFixed(2)}f) * tri;`,
      '      uint8_t v = (uint8_t)(k * 255);',
    )
    if (d.mode === 'full') {
      body.push('      for (int i = 0; i < n; i++) it[i] = base * v;')
    } else if (d.mode === 'single') {
      body.push('      int head = frame % n;', '      for (int i = 0; i < n; i++) it[i] = i == head ? base * v : Color(0,0,0);')
    } else {
      body.push('      int head = frame % n;', '      for (int i = 0; i < n; i++) it[i] = (i == head || i == (head + n/2) % n) ? base * v : Color(0,0,0);')
    }
  } else if (d.type === 'wave') {
    const reach = d.direction === 'out' ? 'frame % 7' : '6 - (frame % 7)'
    body.push(
      `      int reach = ${reach};`,
      '      for (int i = 0; i < n; i++) {',
      '        int dd = abs(i); int dist = dd < n - dd ? dd : n - dd;',
      '        it[i] = dist == reach ? base : Color(0,0,0);',
      '      }',
    )
  }

  body.push('      frame++;')
  return [...header, ...body].join('\n')
}
