import { Button, Flex, Form, FormProps, Input, Layout, Slider, Space, Upload } from 'antd';
import { PlusOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons'
import { Header } from './components/Header';
import { fileToBase64 } from '../../utils';
import { bangumiDB } from '../../service/bangumi-db';

const sourcesValidateTrigger = ['onChange', 'onBlur'];
const sourcesItemRule = [
    {
        required: true,
        whitespace: true,
        message: "Please input passenger's name or delete this field.",
    },
];
const sourcesListRule = [
    {
        validator: async (_: any, sources: any[]) => {
            if (!sources || sources.length < 1) {
                return Promise.reject(new Error('请至少录入一个资源'));
            }
        },
    },
];

const labelCol = { span: 1, offset: 0 };

const onFinish: FormProps['onFinish'] = async (values) => {
    const img = await fileToBase64(values.avatar.file.originFileObj);
    delete values.avatar;
    values.avatar = img;
    bangumiDB.save(values.name, values);
};

const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

export function RecordPage() {
    return <Layout >
        <Header />
        <Form labelCol={labelCol} onFinish={onFinish} onFinishFailed={onFinishFailed} initialValues={{stars: 5}}>
            <Form.Item name="name" label="番名" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="author" label="作者" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="publishTime" label="首播时间" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="readCount" label="已看次数" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="stars" label="评分" rules={[{ required: true }]}>
                <Slider max={5} min={0} step={0.1} />
            </Form.Item>
            <Form.Item name="country" label="国家" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="lastProgress" label="上次进度" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.List
                name="sources"
                rules={sourcesListRule}
            >
                {(fields, { add, remove }, { errors }) => (
                    <>
                        {fields.map((field, index) => (
                            <Form.Item
                                {...field}
                                label={`资源${index + 1}`}
                                required={true}
                                key={field.key}
                                validateTrigger={sourcesValidateTrigger}
                                rules={sourcesItemRule}
                                labelCol={labelCol}
                            >
                                <Flex gap={8}>
                                    <Input placeholder="资源链接" />
                                    {fields.length > 1 ? (
                                        <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => remove(field.name)}
                                        />
                                    ) : null}
                                </Flex>
                            </Form.Item>
                        ))}
                        <Form.Item label={fields.length === 0 ? '资源' : ''} required={fields.length === 0}>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                style={{ width: '100%' }}
                                icon={<PlusOutlined />}
                            >
                                增加一个资源
                            </Button>
                            <Form.ErrorList errors={errors} />
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <Form.Item name="avatar" label="头像" rules={[{ required: false }]}>
                <Upload>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
            </Form.Item>
            <Form.Item name="note" label="备注" rules={[{ required: false }]}>
                <Input />
            </Form.Item>
            <Form.Item>
                <Flex justify='center'>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                </Flex>
            </Form.Item>
        </Form>
    </Layout>
}