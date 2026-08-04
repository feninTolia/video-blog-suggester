import { describe, it, expect } from 'vitest';
import { chunkArticles } from './chunkArticles';

describe('chunkArticles', () => {
  it('returns empty array for empty string', () => {
    expect(chunkArticles('')).toEqual([]);
  });

  it('returns empty array for whitespace only', () => {
    expect(chunkArticles('   \n\t  ')).toEqual([]);
  });

  it('returns single chunk when no h2 present', () => {
    const result = chunkArticles('<p>Hello</p>');
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('Hello');
  });

  it('returns single chunk for multiple elements without h2', () => {
    const result = chunkArticles('<p>Hi</p><span>There</span>');
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('Hi');
    expect(result[0]).toContain('There');
  });

  it('groups h2 with following content into one chunk', () => {
    const result = chunkArticles('<h2>H</h2><p>C</p>');
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('H');
    expect(result[0]).toContain('C');
  });

  it('splits chunk when h2 in middle', () => {
    const result = chunkArticles('<p>Before</p><h2>H</h2><p>After</p>');
    expect(result).toHaveLength(2);
    expect(result[0]).toContain('Before');
    expect(result[1]).toContain('H');
    expect(result[1]).toContain('After');
  });

  it('creates chunk ending with h2 when h2 is last', () => {
    const result = chunkArticles('<p>C</p><h2>H</h2>');
    expect(result).toHaveLength(2);
    expect(result[0]).toContain('C');
    expect(result[1]).toContain('H');
  });

  it('creates separate chunks for multiple h2s', () => {
    const result = chunkArticles('<h2>H1</h2><p>C1</p><h2>H2</h2><p>C2</p>');
    expect(result).toHaveLength(2);
    expect(result[0]).toContain('H1');
    expect(result[0]).toContain('C1');
    expect(result[1]).toContain('H2');
    expect(result[1]).toContain('C2');
  });

  it('creates chunks for consecutive h2s without content', () => {
    const result = chunkArticles('<h2>H1</h2><h2>H2</h2>');
    expect(result).toHaveLength(2);
    expect(result[0]).toContain('H1');
    expect(result[1]).toContain('H2');
  });

  it('groups h2 with nested elements', () => {
    const result = chunkArticles('<h2>H</h2><div><p>N</p></div>');
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('H');
    expect(result[0]).toContain('N');
  });

  it('handles mixed text nodes and elements (text in elements)', () => {
    const result = chunkArticles(
      '<p>Text</p><h2>H</h2><p>more</p><span>text</span>',
    );
    expect(result).toHaveLength(2);
    expect(result[0]).toContain('Text');
    expect(result[1]).toContain('H');
    expect(result[1]).toContain('more');
    expect(result[1]).toContain('text');
  });

  it('trims whitespace from chunks', () => {
    const result = chunkArticles('<h2>  H  </h2>  <p>  C  </p>');
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('H');
    expect(result[0]).toContain('C');
    expect(result[0]).not.toMatch(/^\s/);
    expect(result[0]).not.toMatch(/\s$/);
  });

  it('decodes HTML entities', () => {
    const result = chunkArticles('<h2>A&B</h2><p>AT&T</p>');
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('A&B');
    expect(result[0]).toContain('AT&T');
  });

  it('handles self-closing tags', () => {
    const result = chunkArticles('<h2>H</h2><br/><p>C</p>');
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('H');
    expect(result[0]).toContain('C');
  });

  it('splits on all h2 elements at root level', () => {
    const result = chunkArticles('<div><h2>N</h2></div><h2>T</h2>');
    expect(result).toHaveLength(2);
    expect(result[0]).toContain('N');
    expect(result[1]).toContain('T');
  });

  describe('Real world', () => {
    it('works on a real blog article', () => {
      const html = `<p>I want to talk about short circuiting in programming. It is something that doesn’t really get talked about much, but is incredibly important to understand. Before I jump any further into why it is important, I need to define what short circuiting is.</p>
<h2 id="what-is-short-circuiting-circuiting">What Is Short Circuiting Circuiting?</h2>
<p>Short circuiting is a technique that many programming languages use when evaluating boolean logic (<code>&amp;&amp;</code>, <code>||</code>) to save computing power by skipping unnecessary parts of boolean logic. This is a pretty vague definition, so in order to explain exactly what short circuiting is I want to give some examples. Imagine you have some boolean logic in your code that looks like this <code>true || false</code> . We know that by looking at this the result will be <code>true</code>, but a computer needs to take the execution of this statement piece by piece. This means the computer will look at the first part of the statement which is <code>true</code> then the second part which is <code>||</code> and then finally the last section which is <code>false</code>. The first part is easy for the computer since it just sees that it is <code>true</code> and it can move onto the second part which is <code>||</code>. This is where the computer does something smart and actually short circuits out of the boolean logic. The computer knows that <code>true || anything</code> is always <code>true</code>, and thus it will skip checking the third part of our statement since it knows that no matter what the third part is the result is <code>true</code>. This works the same way with <code>&amp;&amp;</code> as well. For example a computer knows that <code>false &amp;&amp; anything</code> is always <code>false</code> so in a statement like this <code>false &amp;&amp; true</code> the computer will skip the third part since it already knows the answer is <code>false</code>.</p>
<h2 id="why-use-short-circuiting">Why Use Short Circuiting?</h2>
<p>Now from these examples you are probably thinking this is pretty pointless, but short circuiting allows you to do some really nifty conditional logic. If you have ever worked with React you have probably seen code like this <code>isLoaded &amp;&amp; renderContent()</code> . I have used code like this many times in my YouTube videos and <a href="https://courses.webdevsimplified.com/learn-react-today">React course</a>, because it allows us to render content conditionally without having to use an if statement. If we break this code down further we can see that if <code>isLoaded</code> is <code>false</code> then the computer will skip the last part and never call <code>renderContent()</code> since it knows that <code>false &amp;&amp; anything</code> is <code>false</code>. Essentially this code is exactly the same as <code>if (isLoaded) renderContent()</code>, but it is more concise.</p>
<p>React is not the only use case for short circuiting, though. Another, even more common, use case is when you want to assign a default value to a variable. This can be done by doing this <code>const variable = variableValue || 'default'</code> . This code will assign <code>variable</code> to <code>variableValue</code> if it exists or if <code>variableValue</code> does not exist it will set it to <code>'default'</code>. This again works via short circuiting since the computer will look at the first section <code>variableValue</code> and if it is something that evaluates to <code>true</code>, such as an object, then the computer will skip the <code>'default'</code> section of the boolean logic. If <code>variableValue</code> evaluates to <code>false</code>, though, the computer cannot skip anything and it will thus set the variable to <code>'default'</code>. This is essentially the same as the following code.</p>
<pre class="shiki dark-plus" style="background-color:#1E1E1E" tabindex="0"><code><span class="line"><span style="color:#569CD6">let</span><span style="color:#D4D4D4"> </span><span style="color:#9CDCFE">variable</span><span style="color:#D4D4D4"> = </span><span style="color:#CE9178">"default"</span></span>
<span class="line"><span style="color:#C586C0">if</span><span style="color:#D4D4D4"> (</span><span style="color:#9CDCFE">variableValue</span><span style="color:#D4D4D4">) </span><span style="color:#9CDCFE">variable</span><span style="color:#D4D4D4"> = </span><span style="color:#9CDCFE">variableValue</span></span></code></pre>
<p>While these are the most common use cases of short circuiting it is by no means the full list. There are tons of use cases for short circuiting as a way to make your code cleaner and easier to write, but they all revolve around the concepts of the two examples in this email.</p>`;

      const result = chunkArticles(html);
      expect(result[0]).toContain(
        'I want to talk about short circuiting in programming. It is something that doesn’t really get talked about much, but is incredibly important to understand. Before I jump any further into why it is important, I need to define what short circuiting is.',
      );
      expect(result[1]).toContain('What Is Short Circuiting Circuiting?');
      expect(result[2]).toContain(
        'is when you want to assign a default value to a variable',
      );
    });
  });
});
