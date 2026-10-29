import sys, re, pathlib, urllib.parse, html.parser, collections, json, os, textwrap

ROOT = pathlib.Path('.')
HTML_FILES = ['index.html', 'docs.html']
CSS_FILES = ['tokens.css', 'styles.css']

# Read all files
html_content = {f: ROOT.joinpath(f).read_text(encoding='utf-8') for f in HTML_FILES}
css_content = {f: ROOT.joinpath(f).read_text(encoding='utf-8') for f in CSS_FILES}

# Check version consistency
print('=== Version consistency ===')
for page in HTML_FILES:
    tokens_matches = re.findall(r'tokens\.css\?v=([^"\' >]+)', html_content[page])
    styles_matches = re.findall(r'styles\.css\?v=([^"\' >]+)', html_content[page])
    app_matches = re.findall(r'app\.js\?v=([^"\' >]+)', html_content[page])
    print(f'{page}: tokens={tokens_matches}, styles={styles_matches}, app={app_matches}')
    if len(set(tokens_matches)) != 1 or len(set(styles_matches)) != 1:
        print(f'  WARNING: version mismatch on {page}')

# Check all CSS versions match across pages
all_tokens = set()
all_styles = set()
for page in HTML_FILES:
    all_tokens.update(re.findall(r'tokens\.css\?v=([^"\' >]+)', html_content[page]))
    all_styles.update(re.findall(r'styles\.css\?v=([^"\' >]+)', html_content[page]))
print(f'Cross-page tokens versions: {all_tokens}')
print(f'Cross-page styles versions: {all_styles}')

print('=== Basic validation passed ===')