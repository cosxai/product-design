// SiteNav — converted once from the Claude Design export (Site Nav.dc.html); edit freely.
import { Fragment } from 'react';

import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';

/* eslint-disable */
class Logic extends DCLogic {
  renderVals() {
    const zh = (this.props.lang ?? 'zh') === 'zh',
      cur = this.props.current ?? '';
    const S = zh ? '即将推出' : 'Soon',
      D = zh ? '草稿' : 'Draft',
      M = 'Metaroom';
    const spec = '../ui-spec/Metaroom Components.dc.html',
      pages = '../pages/';
    const G = [
      ['概览', 'Overview', [['home', '首页', 'Home', '/']]],
      [
        '基础',
        'Foundations',
        [
          ['colour', '颜色', 'Colour', '/colour'],
          ['type', '字体', 'Typography', '/typography'],
          ['space', '间距与形状', 'Spacing and shape', '/spacing'],
          ['motion', '动效', 'Motion', '/motion'],
          ['injection', '品牌注入', 'Brand injection', '/brand-injection'],
        ],
      ],
      [
        '品牌',
        'Brand',
        [
          ['logo', '标志', 'Logo', '/logo'],
          ['yellow', '黄色', 'The yellow', '/yellow'],
          ['marker', '标记', 'The marker', '/marker'],
          ['voice', '语气', 'Voice', '/voice'],
        ],
      ],
      [
        '组件',
        'Components',
        [
          ['button', '按钮', 'Button', '/button'],
          ['input', '输入框', 'Input', '/input'],
          ['select', '下拉选择', 'Select', '/select'],
          ['badge', '状态徽章', 'Badge', '/badge'],
          ['dialog', '对话框', 'Dialog', '/dialog'],
          ['upload', '上传', 'Upload', '/upload'],
          ['loader', '加载动画', 'Loader', '/loader'],
          ['checkbox', '勾选与开关', 'Checkbox and switch', '/checkbox'],
          ['tabs', '标签页', 'Tabs', '/tabs'],
          ['toast', '提示', 'Toast', '/toast'],
          ['table', '表格', 'Table', '/table'],
        ],
      ],
      [
        '更多组件',
        'More components',
        [
          ['data', '数据展示', 'Data display', '/data-display'],
          ['overlays', '浮层与菜单', 'Overlays and menus', '/overlays'],
          ['feedback', '即时反馈', 'Feedback', '/feedback'],
          ['avatars', '头像与成员', 'Avatars and members', '/avatars'],
          ['share', '分享对话框', 'Share dialog', '/share-dialog'],
          ['kanban', '看板', 'Board', '/kanban'],
          ['editing', '编辑与签署', 'Editing and signing', '/editing'],
          ['formext', '表单扩展', 'Form extensions', '/form-extensions'],
          ['charts', '产品图表', 'Charts', '/charts'],
          ['system', '系统级', 'System', '/system'],
          ['mobile', '手机端', 'Mobile', '/mobile'],
          ['bilingual', '中英文', 'Chinese and English', '/bilingual'],
        ],
      ],
      [
        '产品模式',
        'Patterns',
        [
          ['nav', '导航', 'Navigation', '/pattern-navigation'],
          ['actionbar', '操作栏', 'Action bar', '/pattern-action-bar'],
          ['agent', 'Agent 对话', 'Agent conversation', '/pattern-agent'],
          ['status', '状态', 'Status', '/pattern-status'],
          ['signin', '登录', 'Sign-in', '/pattern-sign-in'],
        ],
      ],
      [
        '页面模板',
        'Templates',
        [
          ['auth', '登录与注册', 'Sign in', '/template-sign-in'],
          ['settings', '设置', 'Settings', '/template-settings'],
          ['list', '列表与文档库', 'Lists', '/template-list'],
          ['viewer', '查看器', 'Viewer', '/template-viewer'],
        ],
      ],
      [
        '更多',
        'More',
        [
          ['writing', '内容写作', 'Writing', '/writing'],
          ['downloads', '资源下载', 'Downloads', '/downloads'],
          ['changelog', '更新日志', 'Changelog', '/#changelog'],
        ],
      ],
    ];
    return {
      groups: G.map(([z, e, items]) => ({
        label: zh ? z : e,
        items: items.map(([k, iz, ie, href, tag]) => {
          const on = k === cur;
          return {
            label: zh ? iz : ie,
            href: href || '#',
            title: href ? '' : S,
            tag: tag || '',
            tagD: tag ? 'inline' : 'none',
            tagFg: on ? 'rgba(17,17,17,.7)' : 'var(--text-secondary)',
            bg: on ? 'var(--brand-field, var(--yellow))' : 'transparent',
            fg: on ? 'var(--ink)' : href ? 'var(--text-primary)' : 'var(--text-secondary)',
            w: on ? 500 : 400,
          };
        }),
      })),
    };
  }
}

export const pageCss = '';

export default function SiteNav(props) {
  const v = useLogic(Logic, props);
  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: '64px',
          width: '248px',
          height: 'calc(100vh - 64px)',
          boxSizing: 'border-box',
          padding: '20px 16px 48px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          overflowY: 'auto',
          borderRight: '1px solid var(--rule-soft)',
          background: 'var(--bg-page)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-sans-cjk)',
        }}
      >
        {' '}
        {list(v.groups).map((g$, $i) => {
          const s1 = { ...v, g: g$, $index: $i };
          return (
            <Fragment key={$i}>
              {' '}
              <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', padding: '18px 10px 6px' }}>
                {show(s1.g?.label)}
              </div>{' '}
              {list(s1.g?.items).map((i$, $i) => {
                const s2 = { ...s1, i: i$, $index: $i };
                return (
                  <Fragment key={$i}>
                    <a
                      href={s2.i?.href}
                      title={s2.i?.title}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        minHeight: '32px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        fontSize: '13.5px',
                        textDecoration: 'none',
                        background: s2.i?.bg,
                        color: s2.i?.fg,
                        fontWeight: s2.i?.w,
                      }}
                    >
                      {show(s2.i?.label)}
                      <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: '500', color: s2.i?.tagFg, display: s2.i?.tagD }}>
                        {show(s2.i?.tag)}
                      </span>
                    </a>
                  </Fragment>
                );
              })}{' '}
            </Fragment>
          );
        })}
      </nav>
    </>
  );
}
