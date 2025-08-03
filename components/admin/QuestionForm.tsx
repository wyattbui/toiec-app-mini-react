// components/admin/QuestionForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  Card, 
  Space, 
  Upload, 
  message,
  Switch,
  Divider,
  Typography 
} from 'antd';
import type { UploadProps, UploadFile } from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  UploadOutlined,
  SaveOutlined,
  ClearOutlined,
  AudioOutlined,
  FileImageOutlined
} from '@ant-design/icons';
import type { Question, Option, Part } from '@/stores/useQuizStore';
import { useAuth } from '@/contexts/AuthContext';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface QuestionFormProps {
  question?: Question | null;
  parts: Part[];
  onSave: (questionData: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function QuestionForm({ 
  question, 
  parts, 
  onSave, 
  onCancel, 
  loading = false 
}: QuestionFormProps) {
  const [form] = Form.useForm();
  const { token } = useAuth();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [audioFileList, setAudioFileList] = useState<UploadFile[]>([]);
  const [imageFileList, setImageFileList] = useState<UploadFile[]>([]);
  const [options, setOptions] = useState<Array<{
    id?: number;
    optionLetter: string;
    optionText: string;
    isCorrect: boolean;
  }>>([
    { optionLetter: 'A', optionText: '', isCorrect: false },
    { optionLetter: 'B', optionText: '', isCorrect: false },
    { optionLetter: 'C', optionText: '', isCorrect: false },
    { optionLetter: 'D', optionText: '', isCorrect: false },
  ]);

  useEffect(() => {
    if (question) {
      // Edit mode - populate form with existing question data
      form.setFieldsValue({
        partId: question.partId,
        questionText: question.questionText,
        questionType: question.questionType,
        difficulty: question.difficulty,
        explanation: question.explanation,
        audioUrl: question.audioUrl || '',
        imageUrl: question.imageUrl || '',
        passageText: question.passageText || '',
        passageTitle: question.passageTitle || '',
      });
      
      if (question.options && question.options.length > 0) {
        setOptions(question.options.map(opt => ({
          id: opt.id,
          optionLetter: opt.optionLetter,
          optionText: opt.optionText,
          isCorrect: opt.isCorrect
        })));
      }
    } else {
      // Create mode - reset form
      form.resetFields();
      setOptions([
        { optionLetter: 'A', optionText: '', isCorrect: false },
        { optionLetter: 'B', optionText: '', isCorrect: false },
        { optionLetter: 'C', optionText: '', isCorrect: false },
        { optionLetter: 'D', optionText: '', isCorrect: false },
      ]);
    }
  }, [question, form]);

  const handleOptionChange = (index: number, field: string, value: any) => {
    const newOptions = [...options];
    (newOptions[index] as any)[field] = value;
    
    // If setting this option as correct, uncheck others
    if (field === 'isCorrect' && value === true) {
      newOptions.forEach((opt, i) => {
        if (i !== index) opt.isCorrect = false;
      });
    }
    
    setOptions(newOptions);
  };

  const addOption = () => {
    const nextLetter = String.fromCharCode(65 + options.length); // A, B, C, D, E, ...
    setOptions([...options, {
      optionLetter: nextLetter,
      optionText: '',
      isCorrect: false
    }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) {
      message.warning('Phải có ít nhất 2 lựa chọn!');
      return;
    }
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  // Upload handlers
  const handleUpload = async (file: File, type: 'audio' | 'image') => {
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const uploadedFile = data.files?.[0];
        if (uploadedFile) {
          // Update form field with uploaded URL
          if (type === 'audio') {
            form.setFieldValue('audioUrl', uploadedFile.url);
          } else {
            form.setFieldValue('imageUrl', uploadedFile.url);
          }
          message.success(`Upload ${type === 'audio' ? 'audio' : 'hình ảnh'} thành công!`);
          return true;
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      message.error(`Lỗi upload ${type === 'audio' ? 'audio' : 'hình ảnh'}!`);
      return false;
    } finally {
      setUploadLoading(false);
    }
  };

  const audioUploadProps: UploadProps = {
    name: 'files',
    multiple: false,
    accept: '.mp3,.wav,.m4a',
    fileList: audioFileList,
    beforeUpload: (file) => {
      // Check file type
      const isAudio = file.type.startsWith('audio/');
      if (!isAudio) {
        message.error('Chỉ được upload file audio!');
        return false;
      }
      
      // Check file size (max 10MB)
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File audio phải nhỏ hơn 10MB!');
        return false;
      }

      // Handle upload
      handleUpload(file, 'audio');
      return false; // Prevent default upload
    },
    onChange: ({ fileList }) => {
      setAudioFileList(fileList.slice(-1)); // Keep only last file
    },
    onRemove: () => {
      form.setFieldValue('audioUrl', '');
      setAudioFileList([]);
    },
  };

  const imageUploadProps: UploadProps = {
    name: 'files',
    multiple: false,
    accept: '.jpg,.jpeg,.png,.gif',
    fileList: imageFileList,
    beforeUpload: (file) => {
      // Check file type
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ được upload file hình ảnh!');
        return false;
      }
      
      // Check file size (max 5MB)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('File hình ảnh phải nhỏ hơn 5MB!');
        return false;
      }

      // Handle upload
      handleUpload(file, 'image');
      return false; // Prevent default upload
    },
    onChange: ({ fileList }) => {
      setImageFileList(fileList.slice(-1)); // Keep only last file
    },
    onRemove: () => {
      form.setFieldValue('imageUrl', '');
      setImageFileList([]);
    },
  };

  const handleSubmit = async (values: any) => {
    // Validate at least one correct answer
    const hasCorrectAnswer = options.some(opt => opt.isCorrect);
    if (!hasCorrectAnswer) {
      message.error('Vui lòng chọn ít nhất một đáp án đúng!');
      return;
    }

    // Validate all options have text
    const hasEmptyOption = options.some(opt => !opt.optionText.trim());
    if (hasEmptyOption) {
      message.error('Vui lòng điền đầy đủ nội dung cho tất cả lựa chọn!');
      return;
    }

    const questionData = {
      ...values,
      options: options.map(opt => ({
        ...opt,
        optionText: opt.optionText.trim()
      }))
    };

    try {
      await onSave(questionData);
      
      // If this is create mode (not edit), reset form after successful creation
      if (!question) {
        form.resetFields();
        setOptions([
          { optionLetter: 'A', optionText: '', isCorrect: false },
          { optionLetter: 'B', optionText: '', isCorrect: false },
          { optionLetter: 'C', optionText: '', isCorrect: false },
          { optionLetter: 'D', optionText: '', isCorrect: false },
        ]);
        setAudioFileList([]);
        setImageFileList([]);
        message.success('Tạo câu hỏi thành công! Form đã được làm mới để tạo câu hỏi tiếp theo.');
      } else {
        message.success('Cập nhật câu hỏi thành công!');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu câu hỏi!');
    }
  };

  return (
    <Card 
      title={
        <Title level={4}>
          {question ? '✏️ Chỉnh sửa câu hỏi' : '➕ Tạo câu hỏi mới'}
        </Title>
      }
      className="shadow-lg"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
      >
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Part"
            name="partId"
            rules={[{ required: true, message: 'Vui lòng chọn Part!' }]}
          >
            <Select placeholder="Chọn Part">
              {parts.map(part => (
                <Select.Option key={part.id} value={part.id}>
                  Part {part.partNumber}: {part.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Loại câu hỏi"
            name="questionType"
            rules={[{ required: true, message: 'Vui lòng chọn loại câu hỏi!' }]}
          >
            <Select placeholder="Chọn loại">
              <Select.Option value="multiple_choice">Trắc nghiệm</Select.Option>
              <Select.Option value="listening">Nghe</Select.Option>
              <Select.Option value="reading">Đọc</Select.Option>
              <Select.Option value="conversation">Hội thoại</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          label="Độ khó"
          name="difficulty"
          rules={[{ required: true, message: 'Vui lòng chọn độ khó!' }]}
        >
          <Select placeholder="Chọn độ khó">
            <Select.Option value="easy">Dễ</Select.Option>
            <Select.Option value="medium">Trung bình</Select.Option>
            <Select.Option value="hard">Khó</Select.Option>
          </Select>
        </Form.Item>

        {/* Question Content */}
        <Form.Item
          label="Nội dung câu hỏi"
          name="questionText"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}
        >
          <TextArea 
            rows={4} 
            placeholder="Nhập nội dung câu hỏi..."
          />
        </Form.Item>

        {/* Media URLs */}
        <Divider orientation="left">📁 Media Files</Divider>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Audio Upload */}
          <div>
            <Form.Item
              label={
                <span>
                  <AudioOutlined /> URL Audio (tùy chọn)
                </span>
              }
              name="audioUrl"
            >
              <Input 
                placeholder="https://example.com/audio.mp3"
                prefix={<UploadOutlined />}
              />
            </Form.Item>
            <div className="mt-2">
              <Upload {...audioUploadProps}>
                <Button 
                  icon={<UploadOutlined />} 
                  loading={uploadLoading}
                  size="small"
                >
                  📎 Upload Audio (.mp3, .wav, .m4a)
                </Button>
              </Upload>
              <Text type="secondary" className="text-xs mt-1 block">
                Tối đa 10MB. Sẽ tự động cập nhật URL above sau khi upload.
              </Text>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Form.Item
              label={
                <span>
                  <FileImageOutlined /> URL Hình ảnh (tùy chọn)
                </span>
              }
              name="imageUrl"
            >
              <Input 
                placeholder="https://example.com/image.jpg"
                prefix={<UploadOutlined />}
              />
            </Form.Item>
            <div className="mt-2">
              <Upload {...imageUploadProps}>
                <Button 
                  icon={<UploadOutlined />} 
                  loading={uploadLoading}
                  size="small"
                >
                  🖼️ Upload Image (.jpg, .png, .gif)
                </Button>
              </Upload>
              <Text type="secondary" className="text-xs mt-1 block">
                Tối đa 5MB. Sẽ tự động cập nhật URL above sau khi upload.
              </Text>
            </div>
          </div>
        </div>

        {/* Passage (for reading questions) */}
        <Form.Item
          label="Tiêu đề đoạn văn (tùy chọn)"
          name="passageTitle"
        >
          <Input placeholder="Tiêu đề cho đoạn văn đọc hiểu..." />
        </Form.Item>

        <Form.Item
          label="Nội dung đoạn văn (tùy chọn)"
          name="passageText"
        >
          <TextArea 
            rows={6} 
            placeholder="Nội dung đoạn văn để đọc hiểu..."
          />
        </Form.Item>

        <Divider>Lựa chọn đáp án</Divider>

        {/* Options */}
        <div className="space-y-4">
          {options.map((option, index) => (
            <Card 
              key={index} 
              size="small"
              className="border-gray-200"
              title={`Lựa chọn ${option.optionLetter}`}
              extra={
                options.length > 2 && (
                  <Button 
                    type="text" 
                    danger 
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => removeOption(index)}
                  >
                    Xóa
                  </Button>
                )
              }
            >
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <Input.TextArea
                    value={option.optionText}
                    onChange={(e) => handleOptionChange(index, 'optionText', e.target.value)}
                    placeholder={`Nhập nội dung lựa chọn ${option.optionLetter}...`}
                    rows={2}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <Text type="secondary" className="text-xs mb-1">Đáp án đúng</Text>
                  <Switch
                    checked={option.isCorrect}
                    onChange={(checked) => handleOptionChange(index, 'isCorrect', checked)}
                    checkedChildren="✓"
                    unCheckedChildren="✗"
                  />
                </div>
              </div>
            </Card>
          ))}

          {options.length < 6 && (
            <Button 
              type="dashed" 
              block 
              icon={<PlusOutlined />}
              onClick={addOption}
            >
              Thêm lựa chọn
            </Button>
          )}
        </div>

        {/* Explanation */}
        <Form.Item
          label="Giải thích đáp án"
          name="explanation"
        >
          <TextArea 
            rows={3} 
            placeholder="Giải thích tại sao đáp án này đúng..."
          />
        </Form.Item>

        <Divider />

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button 
            onClick={onCancel}
            size="large"
          >
            Hủy
          </Button>
          <Button 
            icon={<ClearOutlined />}
            onClick={() => {
              form.resetFields();
              setOptions([
                { optionLetter: 'A', optionText: '', isCorrect: false },
                { optionLetter: 'B', optionText: '', isCorrect: false },
                { optionLetter: 'C', optionText: '', isCorrect: false },
                { optionLetter: 'D', optionText: '', isCorrect: false },
              ]);
            }}
            size="large"
          >
            Xóa form
          </Button>
          <Button 
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={loading}
            size="large"
          >
            {question ? 'Cập nhật' : 'Tạo câu hỏi'}
          </Button>
        </div>
      </Form>
    </Card>
  );
}
